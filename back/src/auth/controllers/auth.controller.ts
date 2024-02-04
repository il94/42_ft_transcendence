import { Body, Controller, Get, Post, Patch, HttpCode, ParseIntPipe, HttpStatus, Req, Res, BadRequestException,  UseGuards, UnauthorizedException, Param, ConflictException } from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import { Api42AuthGuard, JwtGuard } from '../guards/auth.guard';
import { AuthDto, CreateUserDto, TwoFaDto } from "../dto/";
import { getUser } from "../decorators/users.decorator";
import { UsersService } from "../services/users.service";
import { Response, Request } from 'express';
import { User, UserStatus } from '@prisma/client';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService, 
		private userService: UsersService) {}

	/*********************** Auth form routes *******************************/

	// Cree un user et renvoie un token d'authentification
	@Post('signup')
	async signup(@Body() userDatas: CreateUserDto): Promise<{ access_token: string }> {
		return await this.authService.signup(userDatas)
	}

	@Post('signin')
	async signin(@Body() dto: AuthDto, @Res({ passthrough: true }) res: Response): 
	Promise<{ access_token: string} | Partial<User>> {
		try {
			type token = Partial<User> | { access_token: string }
			const tok: token  = await this.authService.validateUser(dto);
			if ('id' in tok)
				res.clearCookie('id').clearCookie('two_FA')
			return tok;
		} catch (error) {
			throw error
		}
	}

	@Get('logout')
	@UseGuards(JwtGuard)
	async logout(@getUser() user: User, @Res({ passthrough: true }) res: Response): Promise<void> {
		res.clearCookie('id').clearCookie('access_token').clearCookie('two_FA')
		this.authService.logout(user.id);
	}

	/*********************** Api42 routes ****************** ****************/

	@Get('api42')
	@UseGuards(Api42AuthGuard)
	async get42User(@getUser() user: User): Promise<User> {
		return user;
	}

	@Get('api42/callback')
	@UseGuards(Api42AuthGuard)
	async handle42Redirect(@getUser() user: {usernameId: string, avatar: string, isNew: boolean} | Partial<User> | User, 
	@Res({ passthrough: true }) res: Response,
	): Promise<void> {
		try {
			if (!user)
				throw new BadRequestException("Can't find user from 42 intra");
			if ('id' in user) { // utilisateur 42 connu
				const token = await this.authService.signToken(user.id, user.username);
				if (!user.twoFA) {
					res.clearCookie('token', { httpOnly: true })
					.cookie('isNew', false)
					.cookie("access_token", token.access_token)
					.redirect("http://localhost:5173")
				}
				res.cookie('two_FA', true)
				.cookie('userId', user.id)
				.redirect(`http://localhost:5173/twofa`)	
			}
			if ('isNew' in user) {
				const fiveMin = Date.now() + 5 * 60 * 1000;
				res.cookie('usernameId', user.usernameId, { expires: new Date(fiveMin), /*httpOnly: true*/ })
				.cookie("avatar", user.avatar, { expires: new Date(fiveMin) })
				.redirect("http://localhost:5173/signup42")
			}
		} catch (error) {
			throw new BadRequestException(error.message)
		}
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
	async turnOnTwoFA(@getUser() user: User, @Body() body: TwoFaDto): Promise <boolean> {
		try {
			if (!body.twoFACode)
				throw new BadRequestException('Empty 2FA code');
			const tfaUser = await this.userService.turnOnTwoFA(user, body.twoFACode);
			return  tfaUser.twoFA 
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	@Post('2fa/authenticate/:id')
  	@HttpCode(200)
  	async authenticate(@Param('id', ParseIntPipe) id: number, @Body() body: TwoFaDto): Promise <{access_token: string}> {
		try {
			const user = await this.userService.findUser(id);
			if (user.status === UserStatus.ONLINE)
				throw new BadRequestException('User is already authenticated');
			if (!body.twoFACode)
				throw new BadRequestException('Empty 2FA code');
			const token: { access_token: string } = await this.authService.loginWith2fa(user.id, body.twoFACode);
			return token;
		} catch (error) {
			throw new BadRequestException(error.message);
		}
  	}

	@Patch('2fa/disable')
	@HttpCode(200)
	@UseGuards(JwtGuard)
	async disable(@getUser() user: User, @Body() body): Promise <boolean> {
		try {
			const disable: boolean =  await this.userService.disableTwoFA(user, body.TwoFA)
			return disable;
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

}
