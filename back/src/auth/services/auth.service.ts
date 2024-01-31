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
import { AppGateway } from 'src/app.gateway';
import { toDataURL } from 'qrcode';

@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService, 
		private jwt: JwtService, 
		private userService: UsersService,
		private appGateway: AppGateway
		) {}

	async signup(dto: CreateUserDto): Promise<{ access_token: string }>{
		try {
			const newUser = await this.userService.createUser(dto);
			delete newUser.hash;
			return this.signToken(newUser.id, newUser.username);
		} catch (error) {
            throw new BadRequestException(error.message)
        }	
	}

	async validateUser(dto: AuthDto): Promise<{ access_token: string } | Partial<User>> {
		try {
			const user = await this.prisma.user.findUnique({
					where: { email: dto.email, },
				});
			if (!user)
				throw new BadRequestException('user not found');
			const pwdMatch = await argon.verify(user.hash, dto.hash);
			if (!pwdMatch)
				throw new ForbiddenException('incorrect password');
			const token: { access_token: string } = await this.signToken(user.id, user.username)
			if(user.twoFA === false) {
				await this.prisma.user.update({
						where: { id: user.id },
						data: { status: UserStatus.ONLINE }
				})
				this.appGateway.server.emit("updateUserStatus", user.id, UserStatus.ONLINE);
				return token;
			} else
				return { id: user.id, twoFA: user.twoFA };
		} catch (error) {
            throw new BadRequestException(error.message)
        }
	}

	async signToken(userId: number, username: string): Promise<{ access_token: string }> {
		const payload = {
			sub: userId,
			username
		};
		const token =  await this.jwt.signAsync(payload, { secret: process.env.JWT_SECRET })
		if (!token)
			throw new BadRequestException("Failed to generate access_token")
		return { access_token: token, }
	}

	async logout(userId: number): Promise<{success: boolean}> {
		try {
			const findUser = await this.userService.findUser(userId);
			if (findUser.status === UserStatus.OFFLINE)
				throw new BadRequestException(`User already logout`)
			const user = await this.prisma.user.update({
				where: { id: userId },
				data: { status: UserStatus.OFFLINE }
			})
			if (!user)
				throw new BadRequestException(`Failed to disconnect User with id ${userId}`)
			this.appGateway.server.emit("updateUserStatus", userId, UserStatus.OFFLINE);
			return { success: true };
		} catch (error) {
            throw new BadRequestException(error.message)
		}
	}

	/*********************** api42 Authentication ******************************************/

	async validate42User(profile: any): Promise<{user: User, isNew: boolean} | Partial<User> | User> {
		try {
			const user = await this.prisma.user.findUnique({
				where: { email: profile.email, },
			});
			if (user) {
				if (!user.twoFA) {
					const logUser = await this.prisma.user.update({ 
						where: { email: profile.email },
						data: { status: UserStatus.ONLINE }})
					return logUser
				}
				return { id: user.id, twoFA: user.twoFA };
			}
			console.log ("jai pas trouve le user");
			profile.hash = generate({ length: 6, numbers: true });
			const newUser = await this.userService.createUser(profile as CreateUserDto)
			if (!newUser)
				throw new ForbiddenException('Failed to create new 42 user');
			return { user: newUser, isNew: true }
		} catch (error) {
            throw new BadRequestException(error.message)
		}
	}

	/*********************** TwoFA Authentication ******************************************/

	async generateQrCodeDataURL(otpAuthUrl: string): Promise<string> {
		return toDataURL(otpAuthUrl);
	}

	async generateTwoFASecret(user: User): Promise <{ secret:string, otpAuthURL: string}> {
		const secret = authenticator.generateSecret();
		const otpAuthURL = authenticator.keyuri(user.email, process.env.AUTH_APP_NAME, secret);
		await this.userService.setTwoFASecret(secret, user.id);
		return { secret, otpAuthURL };
	}

	async verifyCode(user: User, twoFACode: string): Promise <boolean> {
		return authenticator.verify({
			token: twoFACode,
			secret: user.twoFASecret,
		  });
	}

	async loginWith2fa(user: User, twoFACode: string): Promise <{access_token: string}> {
		if (!await this.verifyCode(user, twoFACode))
			throw new ForbiddenException('Wrong secret code')
		const logUser = await this.prisma.user.update({ 
				where: { id: user.id },
				data: { status: UserStatus.ONLINE }})
		if (!logUser)
			throw new BadRequestException('Failed to log user with 2FA')
		return this.signToken(user.id, user.username)
	}

}