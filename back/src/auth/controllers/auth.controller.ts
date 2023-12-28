import { Body, Controller, Get, Post, HttpCode, HttpStatus, Req, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import { Api42AuthGuard, JwtGuard, LocalAuthGuard } from '../guards/auth.guard';
import { AuthDto, CreateUserDto } from "../dto/";
import { Public, getUser } from "../decorators/users.decorator";
import { response } from "express";

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Public()
	@Get('api42')
	@UseGuards(Api42AuthGuard)
	async get42User(@Req() req) {
		console.log(req.user);
		return req.user;
	}

	@Public()
	@Get('api42/callback')
	@UseGuards(Api42AuthGuard)
	async handle42Redirect(@Req() req: any, @Res() res: Response) {
		const token = await this.authService.validateUser(req.user as AuthDto);

		const url = new URL(`${req.protocol}:${req.hostname}`);
		url.port = process.env.FRONT_PORT;
		url.pathname = 'login';
		url.searchParams.set('code', token.access_token);
	
		response.status(302).redirect(url.href);
	}

	@Post('signin')
	@UseGuards(LocalAuthGuard)
	@HttpCode(HttpStatus.OK)
	async signin(@Body() dto: AuthDto) {
		return this.authService.validateUser(dto);
	}

	@Public()
	@Post('signup')
	@HttpCode(HttpStatus.OK)
	async signup(@Body() dto: CreateUserDto) {
		return this.authService.signup(dto);
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
