import { Body, Controller, Get, Post, HttpCode, HttpStatus, Request, UseGuards } from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import { Api42AuthGuard, JwtGuard } from '../guards/auth.guard';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthDto } from "../dto/auth.dto";
import { CreateUserDto } from "../dto/create-user.dto";
import { getUser } from "../decorators/users.decorator";
import { User } from "@prisma/client"

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

	@HttpCode(HttpStatus.OK)
	@Post('signin')
	signin(@Body() dto: AuthDto) {
		return this.authService.signin(dto);
	}

	@HttpCode(HttpStatus.OK)
	@Post('signup')
	signup(@Body() dto: CreateUserDto) {
		return this.authService.signup(dto);
	}

	@Get('logout')
	logout() {
		return "TODO";
	}

	@HttpCode(HttpStatus.OK)
	@Get()
	getHello() {
		return "Coucou!";
	}

	//@UseGuards(JwtGuard)
	@Get('profile')
	getProfile(@getUser() user: User) {
		console.log(user);
		if (user) {
			return { msg: 'Authenticated' };
		} else { 
			return { msg: 'NOT Authenticated' };
		}

	}
}
