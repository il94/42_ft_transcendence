import { Body, Controller, Get, Post, HttpCode, HttpStatus, Request, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Api42AuthGuard } from './auth.guard';
import { AuthDto } from "./dto";


// separer la logique metier : le controller execute les requetes https
@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Get('/api42/login')
	@UseGuards(Api42AuthGuard)
	handleLogin(dto: AuthDto) {
		console.log("ICI");
		return this.authService.validateUser(dto);
		return {msg: 'api42 Authentication'};
	}

	@Get('api42/redirect')
	@UseGuards(Api42AuthGuard)
	handleRedirect() {
		return {msg: 'ok'};
	}

	// Registering a new user => no mandatory 
	@Post('signup')
	signup(@Body() dto:AuthDto) {
		console.log("ICI");
		return this.authService.signup(dto);
	}

	// loging as a user => no mandatory
	@HttpCode(HttpStatus.OK)
	@Post('signin')
	signin(@Body() dto:AuthDto) {
		return this.authService.validateUser(dto);
	}

	@HttpCode(HttpStatus.OK)
	@Get()
	getHello() {
		return this.authService.getHello();
	}

	//@UseGuards(AuthGuard)
	@Get('profile')
	getProfile(@Request() req) {
	  return req.user;
	}
}