import { Body, Controller, Get, Post, HttpCode, HttpStatus, Request, UseGuards } from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import { Api42AuthGuard, JwtGuard, LocalAuthGuard } from '../guards/auth.guard';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthDto } from "../dto/auth.dto";
import { CreateUserDto } from "../dto/users.dto";
import { getUser } from "../decorators/users.decorator";
import { User } from "@prisma/client";

@Controller('auth')
@ApiTags('authenticate')
export class AuthController {
	constructor(private authService: AuthService) {}

	@UseGuards(Api42AuthGuard)
	@Get('api42')
	handleLogin(@Request() req) {
		console.log(req.user);
		return req.user;
	}

	@HttpCode(HttpStatus.OK)
	@UseGuards(LocalAuthGuard)
	@Post('signin')
	signin(@Body() dto: AuthDto) {
		return this.authService.signin(dto);
	}

	@HttpCode(HttpStatus.OK)
	@Post('signup')
	signup(@Body() dto: CreateUserDto) {
		return this.authService.signup(dto);
	}

	@HttpCode(HttpStatus.OK)
	@Get()
	getHello() {
		return "Coucou!";
	}

	@UseGuards(Api42AuthGuard)
	//@UseGuards(JwtGuard)
	@Get('profile')
	getProfile(@Request() req) {
		console.log("profile: ", req.user);
		if (req.user) {
			return { msg: 'Authenticated' };
		} else { 
			return { msg: 'NOT Authenticated' };
		}

	}
}
