import { Body, Controller, Get, Post, HttpCode, HttpStatus, Request, UseGuards } from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import { Api42AuthGuard, JwtGuard } from '../auth.guard';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthDto } from "../dto/auth.dto";
import { CreateUserDto } from "../dto/create-user.dto";

// separer la logique metier : le controller execute les requetes https
@Controller('auth')
@ApiTags('authenticate')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Get('/api42/login')
	@UseGuards(Api42AuthGuard)
	handleLogin() {
		return {msg: 'api42 Authentication'};
	}

	@Get('api42/redirect')
	@UseGuards(Api42AuthGuard)
	handleRedirect() {
		return {msg: 'ok'};
	}

	// loging as a user => no mandatory
	@HttpCode(HttpStatus.OK)
	@Post('signin')
	@UseGuards(JwtGuard)
	signin(@Body() dto:AuthDto) {
		return this.authService.signin(dto);
	}

	@HttpCode(HttpStatus.OK)
	@Post('signup')
	// @UseGuards(JwtGuard)
	signup(@Body() dto:CreateUserDto) {
		return this.authService.signup(dto);
	}

	@HttpCode(HttpStatus.OK)
	@Get()
	getHello() {
		return "Coucou!";
	}

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
