import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UserController {
	
	// TODO 
	// in pogress from jwt authentication stratgy
	@UseGuards(AuthGuard('jwt42'))
	@Get('me')
	getMe() {
		return "user info";
	}
}
