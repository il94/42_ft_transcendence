import { Body, Controller, Get, Post, Patch, HttpCode, ParseIntPipe, HttpStatus, Req, Res, BadRequestException, UseGuards,  Param, 
	UseInterceptors, UploadedFile, ParseFilePipeBuilder, } from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import { Api42AuthGuard, JwtGuard } from '../guards/auth.guard';
import { AuthDto, CreateUserDto, TwoFaDto } from "../dto/";
import { Public, getUser } from "../decorators/users.decorator";
import { UsersService } from "../services/users.service";
import { Response, Request } from 'express';
import { User, UserStatus } from '@prisma/client';
import { FileInterceptor } from "@nestjs/platform-express";
import { CustomUploadFileTypeValidator } from "../file.validdator";

const MAX_PROFILE_PICTURE_SIZE_IN_BYTES = 2 * 1024 * 1024;
const VALID_UPLOADS_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

type SigninResponse = {
	access_token: string
} | Partial<User>

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService, 
		private userService: UsersService) {}

	/*********************** Auth form routes *******************************/

	// Verifie si le token fourni est valide
	@Post('token')
	async verifyJwt() {}

	@Public()
	@Post('signup')
	@UseInterceptors(FileInterceptor('file'))
	async signup(@Body('newUser') createUserDto: string,
	@UploadedFile(
		new ParseFilePipeBuilder().addValidator(
			new CustomUploadFileTypeValidator({
				fileType: VALID_UPLOADS_MIME_TYPES,
			}),
		)
		.addMaxSizeValidator({ maxSize: MAX_PROFILE_PICTURE_SIZE_IN_BYTES })
		.build({
			fileIsRequired: false,
			errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
		})
	) file?: Express.Multer.File): Promise<{ access_token: string }> {
		const newUser: CreateUserDto = JSON.parse(createUserDto)
		await this.userService.parseMultiPartCreate(newUser)

		return await this.authService.signup(newUser, file)
	}

	@Public()
	@Post('signin')
	async signin(@Body() userDatas: AuthDto, @Res({ passthrough: true }) res: Response): Promise<SigninResponse> {
		const signinResponse: SigninResponse = await this.authService.validateUser(userDatas)
		if ('id' in signinResponse)
			res.clearCookie('id').clearCookie('two_FA')
		return signinResponse
	}

	// Set le statut du user a deconnecte
	@Get('logout')
	async logout(@getUser('id') userId: number) {
		await this.authService.logout(userId)
	}

	/*********************** Api42 routes ****************** ****************/

	// Point d'entree pour l'authentification par 42
	@Public()
	@Get('api42')
	@UseGuards(Api42AuthGuard)
	async get42User() {}
	
	// Selon la reponse de l'api 42, connecte le user OU le redirige vers le twoFA OU lui cree un compte
	@Public()
	@Get('api42/callback')
	@UseGuards(Api42AuthGuard)
	async handle42Redirect(@getUser() user: { usernameId: string, avatar: string, isNew: boolean } | Partial<User>, 
	@Res({ passthrough: true }) res: Response ) {
		await this.authService.return42Response(user, res)
	}

	/*********************** 2FA routes *************************************/

	@Get('2fa/generate')  // cree le service de 2FA en creeant le twoFASecret du user et en generant un QRcode 
	async register(@getUser() user: User): Promise <string> {
		try {
			const { otpAuthURL } = await this.authService.generateTwoFASecret(user);	
			const QRcode = await this.authService.generateQrCodeDataURL(otpAuthURL);
			if (!QRcode)
				throw new BadRequestException('Failed to generate QRCode');
			return (QRcode);
		} catch (error) {
			throw new BadRequestException(error.message)
		}
	}

	@Patch('2fa/enable') // enable TwoFA attend un code envoye dans le body 
	async turnOnTwoFA(@getUser() user: User, @Body() body: TwoFaDto): Promise <{success: boolean}> {
		await this.authService.turnOnTwoFA(user, body.twoFACode);
		return { success: true } 
	}

	// Verifie le code envoye avec l'api de google et renvoie un token d'authentification
	@Public()
	@Post('2fa/authenticate/:id')
  	async authenticate(@Param('id', ParseIntPipe) userId: number,
	@Body() { twoFACode }: TwoFaDto): Promise <{ access_token: string }> {
		return await this.authService.loginWith2fa(userId, twoFACode)
  	}

	@Patch('2fa/disable')
	async disable(@getUser() user: User, @Body() body: TwoFaDto): Promise <{success: boolean}> {
		await this.authService.disableTwoFA(user, body.twoFACode)
		return { success: true }
	}

}