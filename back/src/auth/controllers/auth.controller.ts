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
	async signup(@Body() dto: CreateUserDto) {
		return this.authService.signup(dto);
	}

	@Post('signin')
	@HttpCode(HttpStatus.OK)
	async signin(@Body() dto: AuthDto) {
		return this.authService.validateUser(dto);
	}

	@Get('profile')
	@UseGuards(JwtGuard)
	getProfile(@Req() req) {
		console.log("profile: ", req.user);
		if (req.user) {
			return { msg: 'Authenticated' };
		} else { 
			return { msg: 'NOT Authenticated' };
		}
	}

	@Get('logout')
	@UseGuards(JwtGuard)
	async logout(@getUser() user: User, @Res({ passthrough: true }) res: Response) {
		//console.log(req.cookies);
		//delete req.cookies.token.access_token;
		//console.log("cookie after delete: ", req.cookies);
		//console.log("Res : ", res);
		res.clearCookie('access_token', { httpOnly: true });
		return this.authService.logout(user.id);
	}

	/*********************** Api42 routes ****************** ****************/

	@Get('api42')
	@UseGuards(Api42AuthGuard)
	async get42User(@getUser() user: User) {
		return user;
	}

	@Get('api42/callback')
	@UseGuards(Api42AuthGuard)
	async handle42Redirect(@getUser() user: User, 
	@Res({ passthrough: true }) res: Response,
	@Req() req: Request,
	) {
		if (user) {
			const token = await this.authService.signToken(user.id, user.username);
			
			req.headers.authorization = "Bearer " + token.access_token;
			res.set('Authorization', `Bearer ${token.access_token}`)
			// res.send()
			//return res.redirect(`http://localhost:5173/game`)
			return token;		 
		}
		else
			throw new BadRequestException("Can't find user from 42 intra");
	}

	/*********************** 2FA routes *************************************/

	@Get('2fa/generate')  // cree le service de 2FA en creeant le twoFASecret du user et en generant un QRcode 
	@UseGuards(JwtGuard, Jwt2faAuthGuard )
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
  	@UseGuards(JwtGuard)
  	async authenticate(@getUser() user: User, @Body() body) {
    	if (user.status === UserStatus.ONLINE)
			throw new BadRequestException('User is already authenticated');
		if (!body.twoFACode)
			throw new BadRequestException('Empty 2FA code');
    	return this.authService.loginWith2fa(user, body.twoFACode);
  	}

	@Post('2fa/disable')
	@HttpCode(200)
	@UseGuards(JwtGuard)
	async disable(@getUser() user: User, @Body() body, @Req() req) {
		return this.userService.disableTwoFA(user, body.twoFACode) //il faut envoyer un code dans le body pour disable la 2FA
	}

}
