import { Body, Controller, Get, Post, HttpCode, HttpStatus, Request, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthGuard } from './auth.guard';
import { AuthDto } from "./dto";


// separer la logique metier : le controller execute les requetes https
@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post('signup')
	signup(@Body() dto:AuthDto) {
		return this.authService.signup(dto);
	}

	@HttpCode(HttpStatus.OK)
	@Post('signin')
	signin(@Body() dto:AuthDto) {
		return this.authService.signin(dto);
	}

	@HttpCode(HttpStatus.OK)
	@Get('signin')
	signin42(@Body() dto:AuthDto) {
		return this.authService.signin(dto);
	}

	@UseGuards(AuthGuard)
	@Get('profile')
	getProfile(@Request() req) {
	  return req.user;
	}
}