import { Body, Controller, Get, Post, Patch, HttpCode, HttpStatus, Req, Res, BadRequestException,  UseGuards, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import { Api42AuthGuard, JwtGuard, Jwt2faAuthGuard  } from '../guards/auth.guard';
import { AuthDto, CreateUserDto } from "../dto/";
import { Public, getUser } from "../decorators/users.decorator";
import { UsersService } from "../services/users.service";
import { Response, Request } from 'express';
import { User, UserStatus } from '@prisma/client';
import { nextTick } from "process";

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService, 
		private userService: UsersService) {}

	/*********************** Auth form routes *******************************/

	@Post('signup')
	@HttpCode(HttpStatus.OK)
	async signup(@Body() dto: CreateUserDto): Promise<string | { access_token: string }> {
		return this.authService.signup(dto);
	}

	@Post('signin')
	@HttpCode(HttpStatus.OK)
	async signin(@Body() dto: AuthDto): Promise<string | { access_token: string }> {
		return this.authService.validateUser(dto);
	}

	@Get('logout')
	@UseGuards(JwtGuard)
	async logout(@getUser() user: User, @Res({ passthrough: true }) res: Response): Promise<void> {
		res.clearCookie('access_token')
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
	async handle42Redirect(@getUser() user: User, 
	@Res({ passthrough: true }) res: Response,
	): Promise<void> {
		if (user) {
			const token = await this.authService.signToken(user.id, user.username);
			res.clearCookie('token', { httpOnly: true })

			res.cookie("access_token", token.access_token);
			res.redirect("http://localhost:5173")		 
		}
		else
			throw new BadRequestException("Can't find user from 42 intra");
	}

	/*********************** 2FA routes *************************************/

	@Get('2fa/generate')  // cree le service de 2FA en creeant le twoFASecret du user et en generant un QRcode 
	@UseGuards(JwtGuard)
	async register(@Res() res, @getUser() user: User) {
		const { otpAuthURL } =
		await this.authService.generateTwoFASecret(user);
	  return res.json(
		await this.authService.generateQrCodeDataURL(otpAuthURL),
	  );
	}

	@Patch('2fa/enable') // enable TwoFA attend un code envoye dans le body 
	@UseGuards(JwtGuard, Jwt2faAuthGuard )
	async turnOnTwoFA(@getUser() user: User, @Body() body) {
		try {
			if (!body.twoFACode)
				throw new BadRequestException('Empty 2FA code');
			await this.userService.turnOnTwoFA(user, body.twoFACode);
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	@Post('2fa/authenticate')
  	@HttpCode(200)
  	//@UseGuards(JwtGuard)
  	async authenticate(@getUser() user: User, @Body() body) {
    	if (user.status === UserStatus.ONLINE)
			throw new BadRequestException('User is already authenticated');
		if (!body.twoFACode)
			throw new BadRequestException('Empty 2FA code');
    	return this.authService.loginWith2fa(user, body.twoFACode);
  	}

	@Patch('2fa/disable')
	@HttpCode(200)
	@UseGuards(JwtGuard)
	async disable(@getUser() user: User, @Body() body, @Req() req) {
		return this.userService.disableTwoFA(user, body.twoFACode) //il faut envoyer un code dans le body pour disable la 2FA
	}

}
