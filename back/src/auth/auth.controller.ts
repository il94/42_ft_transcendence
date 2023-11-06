import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";


// separer la logique metier : le controller execute les requetes https
@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post('signup')
	signup(@Body() dto:AuthDto) {
		return this.authService.signup(dto);
	}

	@Post('signin')
	signin(@Body() dto:AuthDto) {
		return this.authService.signin(dto);
	}
}