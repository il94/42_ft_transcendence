import { Body, Controller, Get, Post, HttpCode, HttpStatus, Request, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Api42AuthGuard, JwtGuard } from './auth.guard';
import { AuthDto } from "./auth.dto";


// separer la logique metier : le controller execute les requetes https
@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Get('/api42/login')
	@UseGuards(Api42AuthGuard)
	handleLogin(dto: AuthDto) {
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
		console.log(dto);
		return this.authService.signup(dto);
	}

	// loging as a user => no mandatory
	@HttpCode(HttpStatus.OK)
	@Post('signin')
	@UseGuards(JwtGuard)
	signin(@Body() dto:AuthDto) {
		console.log(dto);
		return this.authService.signin(dto);
	}

	@HttpCode(HttpStatus.OK)
	@Get()
	getHello() {
		return this.authService.getHello();
	}

	//@UseGuards(AuthGuard)
	@Get('profile')
	getProfile(@Request() req) {
		console.log(req.user);
		if (req.user) {
			return { msg: 'Authenticated' };
		} else { 
			return { msg: 'NOT Authenticated' };
		}

	}
}
