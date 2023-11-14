import { Body, Controller, Get, Post, HttpCode, HttpStatus, Request, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthGuard } from './auth.guard';
import { AuthDto } from "./dto";


// separer la logique metier : le controller execute les requetes https
@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Get('/42api/login')
	handleLogin() {
		return {msg: 'api42 Authentication'};
	}

	@Get('api42/redirect') 
	handleRedirect() {
		return {msg: 'ok'};
	}

	// Registering a new user => no mandatory 
	@Post('signup')
	signup(@Body() dto:AuthDto) {
		return this.authService.signup(dto);
	}

	// loging as a user => no mandatory
	@HttpCode(HttpStatus.OK)
	@Post('signin')
	signin(@Body() dto:AuthDto) {
		return this.authService.signin(dto);
	}

	@HttpCode(HttpStatus.OK)
	@Get()
	getHello() {
		return this.authService.getHello();
	}

	@UseGuards(AuthGuard)
	@Get('profile')
	getProfile(@Request() req) {
	  return req.user;
	}
}