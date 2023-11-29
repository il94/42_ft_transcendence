import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { PrismaClient, User, Prisma, Role, Status } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from "./users.service";
import * as argon from 'argon2';
import { AuthDto } from "../dto/auth.dto";
import { CreateUserDto } from "../dto/create-user.dto";

@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService, 
		private jwt: JwtService, 
		private userService: UsersService) {}

	async signup(dto: CreateUserDto) {
		const newUser = await this.userService.createUser(dto);
		return this.signToken(newUser.id, newUser.username);
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
	async validate42User(profile: any) { // profile: any => profile: AuthDTO
		const user = await this.prisma.user.findUnique({
			where: { username: profile.username, },
		});
		if (!user) {
			console.log ("jai pas trouve le user");
			const newUser = await this.prisma.user.create({
				data: {
					email: profile.email,
					hash: "00", // fonction setHash ? module pour generer un password ?
					avatar: process.env.AVATAR,
					username: profile.username,
					status: Status.ONLINE,
				},
			});
			return newUser; // signtoken ?
		}
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

}