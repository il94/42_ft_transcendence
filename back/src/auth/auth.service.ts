import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from 'argon2';

// les services contiennent la logique metier cad les actions a executer selon la requete envoyee
@Injectable()
export class AuthService {
	constructor(private prisma: PrismaService) {}

	async signup(dto: AuthDto) {
		//generate password hash
		const hash = await argon.hash(dto.password);
		console.log(hash);
		//save new user in db
		const user = await this.prisma.user.create({
			data: {

				email: dto.email,
				hash,
				avatar: dto.avatar,
				nickname: dto.nickname,
			},
		});
		delete user.hash;
		//return saved user
		return user;
		return {msg: "Yop signup"};
	}

	signin() {
		return "I am signed in"
	}
}

