import { Body, Controller, Get, Post, Patch, HttpCode, ParseIntPipe, HttpStatus, Req, Res, BadRequestException,  UseGuards, UnauthorizedException, Param, ConflictException } from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import { Api42AuthGuard, JwtGuard } from '../guards/auth.guard';
import { AuthDto, CreateUserDto, TwoFaDto } from "../dto/";
import { getUser } from "../decorators/users.decorator";
import { UsersService } from "../services/users.service";
import { Response, Request } from 'express';
import { User, UserStatus } from '@prisma/client';

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
	@UseGuards(JwtGuard)
	async verifyJwt() {}

	// Cree un user et renvoie un token d'authentification
	@Post('signup')
	async signup(@Body() userDatas: CreateUserDto): Promise<{ access_token: string }> {
		return await this.authService.signup(userDatas)
	}

	// Verifie le username et le mot de passe
	// Set le statut du user a connecte
	// Renvoie un token d'authentification
	@Post('signin')
	async signin(@Body() userDatas: AuthDto, @Res({ passthrough: true }) res: Response): Promise<SigninResponse> {
		const signinResponse: SigninResponse = await this.authService.validateUser(userDatas)
		if ('id' in signinResponse)
			res.clearCookie('id').clearCookie('two_FA')
		return signinResponse
	}

	// recupere le status dun user
	// @Get(':id/status')
    // @UseGuards(JwtGuard)
    // async getStatus(@getUser('id') userId: number) {
    //     await this.authService.getStatus(userId)
    // }

	// Set le statut du user a deconnecte
	@Get('logout')
	@UseGuards(JwtGuard)
	async logout(@getUser('id') userId: number) {
		await this.authService.logout(userId)
	}

	/*********************** Api42 routes ****************** ****************/

	// Point d'entree pour l'authentification par 42
	@Get('api42')
	@UseGuards(Api42AuthGuard)
	async get42User() {}
	
	// Selon la reponse de l'api 42, connecte le user OU le redirige vers le twoFA OU lui cree un compte
	@Get('api42/callback')
	@UseGuards(Api42AuthGuard)
	async handle42Redirect(@getUser() user: { usernameId: string, avatar: string, isNew: boolean } | Partial<User>, 
	@Res({ passthrough: true }) res: Response ) {
		await this.authService.return42Response(user, res)
	}

	/*********************** 2FA routes *************************************/

	@Get('2fa/generate')  // cree le service de 2FA en creeant le twoFASecret du user et en generant un QRcode 
	@UseGuards(JwtGuard)
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
	@UseGuards(JwtGuard)
	async turnOnTwoFA(@getUser() user: User, @Body() body: TwoFaDto): Promise <{success: boolean}> {
		await this.authService.turnOnTwoFA(user, body.twoFACode);
		return { success: true } 
	}

	// Verifie le code envoye avec l'api de google et renvoie un token d'authentification
	@Post('2fa/authenticate/:id')
  	async authenticate(@Param('id', ParseIntPipe) userId: number,
	@Body() { twoFACode }: TwoFaDto): Promise <{ access_token: string }> {
		return await this.authService.loginWith2fa(userId, twoFACode)
  	}

	@Patch('2fa/disable')
	@UseGuards(JwtGuard)
	async disable(@getUser() user: User, @Body() body: TwoFaDto): Promise <{success: boolean}> {
		await this.authService.disableTwoFA(user, body.twoFACode)
		return { success: true }
	}

}