import { BadRequestException, ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { PrismaClient, User, Prisma, Role, UserStatus } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from "./users.service";
import * as argon from 'argon2';
import { AuthDto } from "../dto/auth.dto";
import { CreateUserDto } from "../dto/users.dto";
import { authenticator } from "otplib";

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

	async validateUser(dto: AuthDto) {
		try {
			let user = await this.prisma.user.findUnique({
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
            console.log("Validate user error: ", err.message);
            throw new BadRequestException(err.message)
        }
	}

	async validate42User(profile: any) {
		try {
			const user = await this.prisma.user.findUnique({
				where: { username: profile.username, },
			});
			if (!user) {
				console.log ("jai pas trouve le user");
				profile.hash = "default";
				const newUser = await this.userService.createUser(profile as CreateUserDto)
				if (!newUser)
					throw new ForbiddenException('Failed to create new 42 user');
				return user;
			}
			return user;
		} catch (error) {
			const err = error as Error;
            console.log("Validate 42 user error: ", err.message);
            throw new BadRequestException(err.message)
		}
	}

	async signToken(userId: number, username: string): Promise<{ access_token: string }> {
		const payload = {
			sub: userId,
			username
		};
		const token =  await this.jwt.signAsync(payload, { secret: process.env.JWT_SECRET })
		return { access_token: token, }
	}

	async _verifyToken(token: string): Promise<any> {
		try {
		  return await this.jwt.verify(token);
		} catch (error) {
		  return null;
		}
	}

	async generateTwoFASecret(user: User) {
		const secret = authenticator.generateSecret();

		const otpAuthURL = authenticator.keyuri(user.email, process.env.AUTH_APP_NAME, secret);
		await this.userService.setTwoFASecret(secret, user.id);

		return { secret, otpAuthURL };
	}

	async isTwoFACodeValid(twoFACode: string, user: User) {
		return authenticator.verify({
			token: twoFACode,
			secret: user.twoFASecret,
		  });
	}

	async loginWith2fa(userWithoutPsw: Partial<User>) {
		const payload = {
		  email: userWithoutPsw.email,
		  isTwoFAOn: !!userWithoutPsw.twoFA,
		  isTwoFAuthenticated: true,
		};
	
		return {
		  email: payload.email,
		  access_token: await this.signToken(userWithoutPsw.id, userWithoutPsw.username),
		};
	}
}