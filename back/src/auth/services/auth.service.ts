import { BadRequestException, ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { PrismaClient, User, Prisma, Role, UserStatus } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from "./users.service";
import * as argon from 'argon2';
import { AuthDto } from "../dto/auth.dto";
import { CreateUserDto } from "../dto/users.dto";

@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService, 
		private jwt: JwtService, 
		private userService: UsersService) {}

	async signup(dto: CreateUserDto) {
		const newUser = await this.userService.createUser(dto);
		delete newUser.hash;
		return this.signToken(newUser.id, newUser.username);
	}

	async signin(dto: AuthDto) {
		try {
			const user = await this.prisma.user.findUnique({
				where: { username: dto.username, },
			});
			if (!user)
				throw new BadRequestException('user not found');
			const pwdMatch = await argon.verify(user.hash, dto.hash);
			if (!pwdMatch)
				throw new ForbiddenException('incorrect password');
			return this.signToken(user.id, user.username)
		} catch (error) {
            const err = error as Error;
            console.log("ICI erreur: ", err.message);
              throw new BadRequestException(err.message)
        }
	}

	// TODO proteger avec un try catch
	async validate42User(profile: any) { // profile: any => profile: AuthDTO
		const user = await this.prisma.user.findUnique({
			where: { username: profile.username, },
		});
		if (!user) {
			console.log ("jai pas trouve le user");
			const newUser = await this.prisma.user.create({
				data: {
					username: profile.username,
					hash: "00",
					email: profile.email,
					avatar: "string",
					phoneNumber: profile.phoneNumber,
					twoFA: false,
					status: UserStatus.ONLINE,
					wins: 0,
					draws: 0,
					losses: 0,
				},
			});
			return this.signToken(user.id, user.username);
		}
		console.log("user data: ", user);
		return this.signToken(user.id, user.username);
	}

	async signToken(userId: number, username: string): Promise<{ access_token: string }> {
		const payload = {
			sub: userId,
			username
		};
		const token =  await this.jwt.signAsync(payload, { expiresIn: '50m', secret: process.env.JWT_SECRET })
		return { access_token: token, }
	}

}