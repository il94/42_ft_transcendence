import { Inject, Injectable } from "@nestjs/common"
import { PassportSerializer } from "@nestjs/passport";
import { AuthService } from "./services/auth.service";
import { User } from "@prisma/client";
import { UsersService } from "./services/users.service";

@Injectable()
export class SessionSerializer extends PassportSerializer {
	constructor(@Inject(UsersService) private readonly userService: UsersService) {
		super();
	}

	serializeUser(user: User, done: Function) {
		done(null, user);
	}
	
	async deserializeUser(payload: any, done: Function) {
		try {
			const user = await this.userService.findById(payload.id);
			return user ? done(null, user) : done(null, null);
		} catch (error) {}
	}
}