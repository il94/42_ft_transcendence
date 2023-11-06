import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaClient, User } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

// les services contiennent la logique metier cad les actions a executer selon la requete envoyee
@Injectable()
export class AuthService {
	constructor(private prisma: PrismaService) {}

	async signup(dto: AuthDto) {
		//generate password hash
		const hash = await argon.hash(dto.password);
		console.log(hash);
		//save new user in db
		try {
			const user = await this.prisma.user.create({
				data: {
	
					email: dto.email,
					hash,
					nickname: dto.nickname,
					avatar: dto.avatar,
					tel: dto.tel,
				},
			});
			delete user.hash;
			return user;
		}
		catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === 'P2002') {
					throw new ForbiddenException('Credentials taken');
				}
			}
			throw error;
		}
	}

	async signin(dto: AuthDto) {
		// find the user by email
		const user = await this.prisma.user.findUnique({
			where: {
				email: dto.email,
			},
		});
		if (!user) throw new ForbiddenException('Credentials incorrect');
		// compare password
		const pwdMatch = await argon.verify(user.hash, dto.password);
		if (!pwdMatch) throw new ForbiddenException('Credentials incorrect');
		delete user.hash;

		return user;
	}
}

