import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from 'passport-jwt';
import { AuthService } from "../services/auth.service";
import { AuthDto } from "../dto/auth.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
	constructor(private readonly prisma: PrismaService) {
		super();
	}
	
	async validate(payload: {sub: number; username: string; }) {
		const user = await this.prisma.user.findUnique({
			where: {
			  id: payload.sub,
			},
		  });
		if (!user) {
			console.log("Non non pas de user");
			throw new UnauthorizedException();
		}
		delete user.hash;
		console.log("user valide: ", user);
		return user;
	}
}