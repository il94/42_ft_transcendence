import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
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

type SigninResponse = {
	access_token: string
} | Partial<User>

@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService, 
		private jwt: JwtService, 
		private userService: UsersService,
		private appGateway: AppGateway
	) {}

	// Cree un user et renvoie un token d'authentification
	async signup(userDatas: CreateUserDto): Promise<{ access_token: string }>{
		try {
			const newUser = await this.userService.createUser(userDatas)
			return this.signToken(newUser.id, newUser.username)
		}
		catch (error) {
			if (error instanceof ForbiddenException || error instanceof ConflictException)
				throw error
			else
				throw new BadRequestException()
		}
	}

	// Renvoie un token d'authentification
	async validateUser(userDatas: AuthDto): Promise<SigninResponse> {
		try {
			// Verifie si le user existe
			const user = await this.prisma.user.findUnique({
				where: {
					username: userDatas.username
				}
			})
			if (!user)
				throw new NotFoundException("User not found")

			// Verifie si le mot de passe fourni est correct
			const pwdMatch = await argon.verify(user.hash, userDatas.hash)
			if (!pwdMatch)
				throw new ForbiddenException("Wrong password")

			// Genere un token d'authentification a partir de l'id et du username
			const token: { access_token: string } = await this.signToken(user.id, user.username)

			// Si le user n'a pas active le twoFA, connecte le user et renvoie son token
			if (user.twoFA === false)
			{
				// Set le statut du user a connecte
				await this.prisma.user.update({
					where: {
						id: user.id
					},
					data: {
						status: UserStatus.ONLINE
					}
				})

				// Emit
				this.appGateway.server.emit("updateUserStatus", user.id, UserStatus.ONLINE)
				return token
			}

			// Si le user a active le twoFA, renvoie les datas necessaires pour le front pour le rediriger vers la page twoFA
			else
				return { id: user.id, twoFA: user.twoFA }
		}
		catch (error) {
			if (error instanceof ForbiddenException || error instanceof NotFoundException)
				throw error
			else if (error instanceof Prisma.PrismaClientKnownRequestError)
				throw new ForbiddenException("The provided user data is not allowed")
			else
				throw new BadRequestException()
		}
	}

	// Genere un token d'authentification
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

			console.log("CONNEXION")
			const user = await this.prisma.user.findUnique({
				where: { usernameId: profile.usernameId, },
			});
			if (user) {
				if (!user.twoFA) {
					const logUser = await this.prisma.user.update({ 
						where: { usernameId: profile.usernameId },
						data: { status: UserStatus.ONLINE }})
					return logUser
				}
				return { id: user.id, twoFA: user.twoFA };
			}
			console.log ("jai pas trouve le user");
			// profile.hash = generate({ length: 6, numbers: true });
			// const newUser = await this.userService.createUser(profile as CreateUserDto)
			// if (!newUser)
			// 	throw new ForbiddenException('Failed to create new 42 user');

			const partialUser: Partial<User> = {
				usernameId: profile.usernameId,
				avatar: profile.avatar,
			}

			return { usernameId: profile.usernameId, avatar: profile.avatar, isNew: true }
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
		const otpAuthURL = authenticator.keyuri(user.username, process.env.AUTH_APP_NAME, secret);
		await this.userService.setTwoFASecret(secret, user.id);
		return { secret, otpAuthURL };
	}

	// Verifie si le code fourni est correct avec l'api de google
	async verifyCode(userTwoFASecret: string, twoFACode: string): Promise <boolean> {
		return authenticator.verify({
			token: twoFACode,
			secret: userTwoFASecret
		  });
	}

	// Verifie le code envoye avec l'api de google et renvoie un token d'authentification
	async loginWith2fa(userId: number, twoFACode: string): Promise <{ access_token: string }> {
		try {
			// Recupere le user avec son username et son twoFaSecret et verifie si il existe et si il n'est pas deja connecte
			const user = await this.prisma.user.findFirst({
				where: {
					id: userId
				},
				select: {
					username: true,
					status: true,
					twoFASecret: true
				}
			})
			if (!user)
				throw new NotFoundException("User not found")
			if (user.status === UserStatus.ONLINE)
				throw new ConflictException("User is already authenticated")

			// Verifie si le code fourni est correct avec l'api de google
			if (!await this.verifyCode(user.twoFASecret, twoFACode))
				throw new ForbiddenException("Wrong code")

			// Set le statut du user a connecte
			await this.prisma.user.update({ 
				where: {
					id: userId
				},
				data: {
					status: UserStatus.ONLINE
				}
			})

			// Retourne un token d'authentification
			return this.signToken(userId, user.username)
		}
		catch (error) {
			if (error instanceof ForbiddenException || error instanceof NotFoundException || error instanceof ConflictException)
				throw error
			else if (error instanceof Prisma.PrismaClientKnownRequestError)
				throw new ForbiddenException("The provided user data is not allowed")
			else
				throw new BadRequestException()
		}
	}

}