import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaClient, User } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./auth.dto";
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private jwt: JwtService
	) {}

	async getHello() {
		return "Coucou!";
	}

	async signin(dto: AuthDto) {
		const user = await this.prisma.user.findUnique({
			where: { username: dto.username, },
		});
		if (!user)
			throw new ForbiddenException('user not found');
		const pwdMatch = await argon.verify(user.hash, dto.hash);
		if (!pwdMatch) 
			throw new ForbiddenException('incorrect password');
		return this.signToken(user.id, user.username);
	}

	// TODO proteger avec un try catch
	async validateUser(profile: any) { // profile: any => profile: AuthDTO
		const user = await this.prisma.user.findUnique({
			where: { username: profile.username, },
		});
		// create user if not found
		if (!user) {
			console.log ("jai pas trouve le user");
			const newUser = await this.prisma.user.create({
				data: {
					email: profile.email,
					hash: "00",
					avatar: process.env.AVATAR,
					id42: profile.id42,
					username: profile.username,
				},
			});
			return newUser;
		}
			//throw new ForbiddenException('Credentials incorrect');
		console.log("user data: ", user);
		return user;
	}


	
	async signToken(userId: number, username: string): Promise<{ access_token: string }> {
		const payload = {
			sub: userId,
			username
		};
		const token =  await this.jwt.signAsync(payload, { expiresIn: '50m', secret: process.env.JWT_SECRET })
		return { access_token: token, }
	}


	async signup(profile: any) {
		const hash = await argon.hash('123');
		console.log('in signup');
		//if (!dto.avatar) { dto.avatar = process.env.AVATAR };
		try {
			const user = await this.prisma.user.create({
				data: {
					email: profile.emails[0].value,
					hash,
					avatar: process.env.AVATAR,
					id42: profile.id,
					username: profile.username,
				},
			});
			return user;
			//return this.signToken(user.id, user.username);
		}
		catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === 'P2002')
					throw new ForbiddenException('Credentials taken');
			}
			throw error;
		}
	}

}