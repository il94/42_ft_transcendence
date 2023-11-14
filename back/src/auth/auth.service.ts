import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaClient, User } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JwtService } from '@nestjs/jwt';

// A service contains business logic : the action to do regarding the request sent
// AuthService's job : retrieving a user verifying the password
@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private jwt: JwtService
	) {}

	//signin and signup logics should be implemented with third part API42 authentication 
	
	async signToken(userId: number, email: string): Promise<{ access_token: string }> {
		const payload = {
			sub: userId,
			email
		};
		const token =  await this.jwt.signAsync(payload, { expiresIn: '15m', secret: process.env.JWT_SECRET })
		return { access_token: token, }
	}

	async signup(dto: AuthDto) {
		//generate password hash
		const hash = await argon.hash(dto.password);
		if (!dto.avatar) { dto.avatar = process.env.AVATAR };
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
			return this.signToken(user.id, user.email);
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
			where: { email: dto.email, },
		});
		if (!user) 
			throw new ForbiddenException('Credentials incorrect');
		
		// compare password
		const pwdMatch = await argon.verify(user.hash, dto.password);
		if (!pwdMatch) 
			throw new ForbiddenException('Credentials incorrect');
		return this.signToken(user.id, user.email);
	}
}

