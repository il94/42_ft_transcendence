import { Body, Controller, Get, Post, Patch, HttpCode, ParseIntPipe, HttpStatus, Req, Res, BadRequestException,  UseGuards, UnauthorizedException, Param } from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import { Api42AuthGuard, JwtGuard, TwoFAGuard  } from '../guards/auth.guard';
import { AuthDto, CreateUserDto } from "../dto/";
import { getUser } from "../decorators/users.decorator";
import { UsersService } from "../services/users.service";
import { Response, Request } from 'express';
import { User, UserStatus } from '@prisma/client';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService, 
		private userService: UsersService) {}

	/*********************** Auth form routes *******************************/

	@Post('signup')
	@HttpCode(HttpStatus.OK)
	async signup(@Body() dto: CreateUserDto, @Res({ passthrough: true }) res: Response): Promise<{access_token: string}> {
		try {
			const token = await this.authService.signup(dto);
			// res.cookie('access_token', token.access_token, { httpOnly: true })
			// 	.send({ status: 'New user authenticated'});
			return token; 
		} catch (error) {
			throw new BadRequestException(error.message)
		}
	}

	@Post('signin')
	@HttpCode(HttpStatus.OK)
	async signin(@Body() dto: AuthDto, @Res({ passthrough: true }) res: Response): 
	Promise<{ access_token: string} | {twoFA: boolean}> {
		try {
			type token = { twoFA: boolean } | { access_token: string }
			const tok: token  = await this.authService.validateUser(dto);
			return tok;
		} catch (error) {
			throw new BadRequestException(error.message)
		}
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
	async handle42Redirect(@getUser() user: User, @Res({ passthrough: true }) res: Response,
	): Promise<void | { twoFA: boolean }> {
		try {
			console.log("user: ", user)
			if (!user)
				throw new BadRequestException("Can't find user from 42 intra");
			if (!user.twoFA) {
				const token = await this.authService.signToken(user.id, user.username);
				res.clearCookie('token', { httpOnly: true })
				res.cookie("access_token", token.access_token);
				res.redirect("http://localhost:5173")
			}
			res.redirect(`http://localhost:5173/twofa`)	
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
	async turnOnTwoFA(@getUser() user: User, @Body() body): Promise <boolean> {
		try {
			if (!body.twoFACode)
				throw new BadRequestException('Empty 2FA code');
			const tfaUser = await this.userService.turnOnTwoFA(user, body.twoFACode);
			return  tfaUser.twoFA 
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	@Post('2fa/authenticate')
  	@HttpCode(200)
  	//@UseGuards(TwoFAGuard)
  	async authenticate(@getUser() user: User, @Body() body): Promise <{access_token: string}> {
		// find le user par son id
		console.log("TODO")
		try {
			//const user = await this.userService.findUser(id);
			if (user.status === UserStatus.ONLINE)
				throw new BadRequestException('User is already authenticated');
			if (!body.twoFACode)
				throw new BadRequestException('Empty 2FA code');
			const token: { access_token: string } = await this.authService.loginWith2fa(user, body.twoFACode);
			return token;
		} catch (error) {
			throw new BadRequestException(error.message);
		}
  	}

	@Patch('2fa/disable')
	@HttpCode(200)
	@UseGuards(JwtGuard, TwoFAGuard)
	async disable(@getUser() user: User, @Body() body): Promise <boolean> {
		try {
			const disable: boolean =  await this.userService.disableTwoFA(user, body.twoFACode)
			return disable;
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

}
