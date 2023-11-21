import { Inject, Injectable } from "@nestjs/common"
import { PassportSerializer } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { User } from "@prisma/client";
import { UserService } from "src/user/user.service";

@Injectable()
export class SessionSerializer extends PassportSerializer {
	constructor(@Inject(AuthService) private readonly userService: UserService) {
		super();
	}
	serializeUser(user: User, done: Function) {
		console.log("Serialize user");
		done(null, user);

	}
	async deserializeUser(payload: any, done: Function) {
		const user = this.userService.findUser(payload.id);
		console.log("Deserialized user : ", user);
		return user ? done(null, user) : done(null, null);
	}
}