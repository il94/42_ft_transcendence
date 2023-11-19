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

	async getHello() {
		return "Coucou!";
	}

	// PB : COMMENT MAPPER l'objet dto avec l'objet profile de api42 strategy ?
	async validateUser(dto: AuthDto) {
		console.log('AuthServive');
		console.log(dto);
		console.log("STOP");
		//find the user by username
		const user = await this.prisma.user.findUnique({
			where: { email: dto.email }, // dto.email is undifined
		});
		// create user if not found
		if (!user)
			this.signup(dto);
			//throw new ForbiddenException('Credentials incorrect');
		console.log(user);

		// compare password
		//const pwdMatch = await argon.verify(user.hash, dto.password);
		//if (!pwdMatch) 
		//	throw new ForbiddenException('Credentials incorrect');
		return this.signToken(user.id, user.email);
	}
	
	// Generate acces token
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
		//const hash = await argon.hash(dto.password);
		console.log("ICI");
		if (!dto.avatar) { dto.avatar = process.env.AVATAR };
		//save new user in db
		try {
			const user = await this.prisma.user.create({
				data: {
					id: 42,
					email: "claire@gmail.com",
					hash: "123",
					nickname: "cléclé",
					avatar: "",
					tel: "",
				},
			});
			return this.signToken(user.id, user.email);
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