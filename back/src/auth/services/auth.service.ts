import { BadRequestException, ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { PrismaClient, User, Prisma, Role, UserStatus } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from "./users.service";
import * as argon from 'argon2';
import { AuthDto } from "../dto/auth.dto";
import { CreateUserDto } from "../dto/users.dto";
import { authenticator } from "otplib";
import { generate } from "generate-password";
import { toDataURL } from 'qrcode';

@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService, 
		private jwt: JwtService, 
		private userService: UsersService) {}

	
	//*********************** General Authentication ******************************************/

	async signup(dto: CreateUserDto) {
		const newUser = await this.userService.createUser(dto);
		delete newUser.hash;
		return this.signToken(newUser.id, newUser.username);
	}

	async validateUser(dto: AuthDto): Promise<string | { access_token: string } | { twoFA: boolean } > {
		try {
			const user = await this.prisma.user.findUnique({
					where: { username: dto.username, },
				});
			if (!user)
				throw new BadRequestException('user not found');
			const pwdMatch = await argon.verify(user.hash, dto.hash);
			if (!pwdMatch)
				throw new ForbiddenException('incorrect password');			
			if(user.twoFA === false) {
				await this.prisma.user.update({ 
					where: { username: dto.username },
					data: { status: UserStatus.ONLINE }})
				return this.signToken(user.id, user.username)
			}
			else
			{
				return {
					twoFA: true
				}
			}
			// else : return nulll to login with 2FA
			// return `User ${user.username} must login with 2FA`
		} catch (error) {
            const err = error as Error;
            console.log("Validate user error: ", err.message);
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

	async verifyToken(token: string): Promise<any> {
		try {
		  return await this.jwt.verify(token);
		} catch (error) {
		  return null;
		}
	}

	async logout(userId: number) {
		const user = this.prisma.user.update({
			where: { id: userId, status: UserStatus.ONLINE },
			data: { status: UserStatus.OFFLINE }
		})
		if (!user)
			throw new BadRequestException(`User with od ${userId}, not found or offline`)
		return user;
	}

	/*********************** api42 Authentication ******************************************/

	async validate42User(profile: any) {
		try {
			const user = await this.prisma.user.findUnique({
				where: { username: profile.username, },
			});
			if (user) {
				if (!user.twoFA) {
					await this.prisma.user.update({ 
						where: { username: profile.username },
						data: { status: UserStatus.ONLINE }})
					return user;
				}
				return `42 User must login with 2FA`;
			}
			console.log ("jai pas trouve le user");
			profile.hash = generate({ length: 6, numbers: true });
			const newUser = await this.userService.createUser(profile as CreateUserDto)
			if (!newUser)
				throw new ForbiddenException('Failed to create new 42 user');
			return newUser;
		} catch (error) {
			const err = error as Error;
            console.log("Validate 42 user error: ", err.message);
            throw new BadRequestException(err.message)
		}
	}

	/*********************** TwoFA Authentication ******************************************/

	async generateQrCodeDataURL(otpAuthUrl: string) {
		return toDataURL(otpAuthUrl);
	}

	async generateTwoFASecret(user: User) {

		const secret = authenticator.generateSecret();

		const otpAuthURL = authenticator.keyuri(user.email, process.env.AUTH_APP_NAME, secret);
		await this.userService.setTwoFASecret(secret, user.id);
		return { secret, otpAuthURL };
	}

	async verifyCode(user: User, twoFACode: string) {
		return authenticator.verify({
			token: twoFACode,
			secret: user.twoFASecret,
		  });
	}

	async loginWith2fa(user: User, twoFACode: string) {
		if (!await this.verifyCode(user, twoFACode))
			throw new ForbiddenException('Wrong secret code')	
		return this.signToken(user.id, user.username)
	}

}