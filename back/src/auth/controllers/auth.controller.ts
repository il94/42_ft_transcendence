import { Body, Controller, Get, Post, HttpCode, HttpStatus, Req, Res, BadRequestException,  UseGuards, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import { Api42AuthGuard, JwtGuard, LocalAuthGuard } from '../guards/auth.guard';
import { AuthDto, CreateUserDto } from "../dto/";
import { Public, getUser } from "../decorators/users.decorator";
import { UsersService } from "../services/users.service";
import { Response } from 'express';
import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService, 
		private userService: UsersService) {}

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

	@Post('2fa/turn-on')
	@UseGuards(JwtGuard)
	async turnOnTwoFA(@Req() request, @Body() body) {
	  const isCodeValid =
		this.authService.isTwoFACodeValid(
		  body.twoFACode,
		  request.user,
		);
	  if (!isCodeValid) {
		throw new UnauthorizedException('Wrong authentication code');
	  }
	  await this.userService.turnOnTwoFA(request.user.id);
	}

	@Post('2fa/authenticate')
  	@HttpCode(200)
  	@UseGuards(JwtGuard)
  	async authenticate(@Req() request, @Body() body) {
    	const isCodeValid = this.authService.isTwoFACodeValid(
      	body.twoFACode,
      	request.user,
    	);

    	if (!isCodeValid) {
      	throw new UnauthorizedException('Wrong authentication code');
    	}

    	return this.authService.loginWith2fa(request.user);
  	}

	@Get('api42')
	@UseGuards(Api42AuthGuard)
	async get42User(@getUser() user: User) {
		return user;
	}

	@Get('api42/callback')
	@UseGuards(Api42AuthGuard)
	async handle42Redirect(@getUser() user: User, @Res() res: Response, @Req() req) {
		if (user) {
			const token = await this.authService.signToken(user.id, user.username);
			console.log("token: ", token);

			res.cookie("access_token", token.access_token);
			res.redirect("http://localhost:5173")
		}
		else
			throw new BadRequestException("Can't find user from 42 intra");
	}

	@Get('profile')
	@UseGuards(Api42AuthGuard)
	getProfile(@Req() req) {
		console.log("profile: ", req.user);
		if (req.user) {
			return { msg: 'Authenticated' };
		} else { 
			return { msg: 'NOT Authenticated' };
		}
	}

}
