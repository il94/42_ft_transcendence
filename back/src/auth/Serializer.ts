import { Inject, Injectable } from "@nestjs/common"
import { PassportSerializer } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { User } from "@prisma/client";

@Injectable()
export class SessionSerializer extends PassportSerializer {
	constructor(@Inject(AuthService) private readonly authService: AuthService) {
		super();
	}
	serializeUser(user: User, done: Function) {
		console.log("Serialize user");
		done(null, user);

	}
	async deserializeUser(payload: any, done: Function) {
		const user = this.authService.findUser(payload.id);
		console.log("Deserialized user : ", user);
		return user ? done(null, user) : done(null, null);
	}
}