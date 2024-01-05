import { Body, Controller, Get, Post, HttpCode, HttpStatus, Req, Res,  UseGuards, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import { Api42AuthGuard, JwtGuard, LocalAuthGuard } from '../guards/auth.guard';
import { AuthDto, CreateUserDto } from "../dto/";
import { Public, getUser } from "../decorators/users.decorator";
import { UsersService } from "../services/users.service";
import { Response } from 'express';

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
	async get42User(@Req() req) {
		return req.user;
	}

	@Get('api42/callback')
	@UseGuards(Api42AuthGuard)
	async handle42Redirect(@Req() req: any, @Res() res: Response) {
		console.log("user in api42/callback : ", req.user);
		if (req.user) {
			const token = await this.authService.signToken(req.user.id, req.user.username);
			res.cookie('access_token', token.access_token, {
			  httpOnly: false,
			});
			if (req.user.twoFA === false) {
			  res.cookie('two_factor_auth', true, {
				httpOnly: false,
			  });
			}
			res.status(302).redirect('http://localhost:5173/game');
		}
		return "OK tu es CO";
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
