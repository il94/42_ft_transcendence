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
import { Response } from "express";
import { Socket } from "socket.io";

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

	// Verifie le username et le mot de passe
	// Set le statut du user a connecte
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

	// Set le statut du user a deconnecte
	async logout(userId: number) {
		try {
			// Verifie si le user existe
			const user = await this.prisma.user.findUnique({
				where: {
					id: userId
				}
			})
			if (!user)
				throw new NotFoundException("User not found")

			// Change le statut du user
			await this.prisma.user.update({
				where: {
					id: userId
				},
				data: {
					status: UserStatus.OFFLINE
				}
			})
		}
		catch (error) {
			if (error instanceof NotFoundException)
				throw error
			else if (error instanceof Prisma.PrismaClientKnownRequestError)
				throw new ForbiddenException("The provided user data is not allowed")
			else
				throw new BadRequestException()
		}
		finally {
			// Deconnecte le socket du user
			const socketUser: Socket | undefined = this.appGateway.getSocketByUserId(userId.toString())
			if (socketUser)
				socketUser.disconnect()
		}
	}

	/*********************** api42 Authentication ******************************************/

	async validate42User(profile: any): Promise<{user: User, isNew: boolean} | Partial<User> | User> {
		try {
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

			const partialUser: Partial<User> = {
				usernameId: profile.usernameId,
				avatar: profile.avatar,
			}

			return { usernameId: profile.usernameId, avatar: profile.avatar, isNew: true }
		} catch (error) {
            throw new BadRequestException(error.message)
		}
	}

	// Selon la reponse de l'api 42, connecte le user OU le redirige vers le twoFA OU lui cree un compte
	async return42Response(user: { usernameId: string, avatar: string, isNew: boolean } | Partial<User>, res: Response ) {
		try {
			// Verifie si le user possebe bien un compte 42
			if (!user)
				throw new BadRequestException("User not found from 42 intra")
			
			// Si le user possede deja un compte dans l'app
			if ('id' in user)
			{
				// Si le user n'a pas active la twoFA
				if (!user.twoFA)
				{
					// Genere un token d'authentification et l'envoie par les cookies
					const token = await this.signToken(user.id, user.username)
						res.clearCookie('token', { httpOnly: true })
						.cookie("access_token", token.access_token)
						.redirect(`https://${process.env.IP}:5173`)
				}
			
				// Si le user a active la twoFA
				else
				{
					// Redirige vers la page twoFA avec les infos necessaires pour le front
					res.cookie('two_FA', true)
					.cookie('userId', user.id)
					.redirect(`https://${process.env.IP}:5173/twofa`)	
				}
			}
			// Si le user ne possede pas de compte dans l'app
			else if ('isNew' in user)
			{
				// Stocke les donnees necessaires a l'authentification dans des
				// cookies de 5 mins  et redirige vers la page de creation de compte
				const fiveMin = Date.now() + 5 * 60 * 1000;
				res.cookie('usernameId', user.usernameId, { expires: new Date(fiveMin), /*httpOnly: true*/ })
				.cookie("avatar", user.avatar, { expires: new Date(fiveMin) })
				.redirect(`https://${process.env.IP}:5173/signup42`)
			}
		}
		catch (error) {
			res.cookie("error_message", error.message).
			redirect(`https://${process.env.IP}:5173/error`)
		}
	}

	/*********************** TwoFA Authentication ******************************************/

	async generateTwoFASecret(user: User): Promise <{ secret:string, otpAuthURL: string}> {
		const secret = authenticator.generateSecret();
		const otpAuthURL = authenticator.keyuri(user.username, process.env.AUTH_APP_NAME, secret);
		await this.setTwoFASecret(secret, user.id);
		return { secret, otpAuthURL };
	}

	async generateQrCodeDataURL(otpAuthUrl: string): Promise<string> {
		return toDataURL(otpAuthUrl);
	}

	async turnOnTwoFA(user: User, twoFACode: string): Promise<User> {
		try {
			const getUser = await this.prisma.user.findUnique({ where: {id: user.id}});
			if (!getUser)
				throw new NotFoundException('User not found');
			if (getUser.twoFA)
				throw new ConflictException('2FA already enabled');

			const isCodeValid = authenticator.verify({
				token: twoFACode,
				secret: getUser.twoFASecret,
			});
			if (!isCodeValid)
				throw new ForbiddenException('Wrong authentication code');
			
				const setUser = await this.prisma.user.update({
				where: { id: user.id, },
				data: { twoFA: true, },
			});
			return setUser;
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

	// Verifie le code envoye avec l'api de google et renvoie un token d'authentification
	async loginWith2fa(userId: number, twoFACode: string): Promise <{ access_token: string }> {
		try {
			// Recupere le user avec son username et son twoFaSecret et verifie si il existe
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
			if (error instanceof ForbiddenException || error instanceof NotFoundException)
				throw error
			else if (error instanceof Prisma.PrismaClientKnownRequestError)
				throw new ForbiddenException("The provided user data is not allowed")
			else
				throw new BadRequestException()
		}
	}

	async disableTwoFA(user: User, code: string) {
		try {
			const otpCode = await this.prisma.user.findUnique({
				where: { id: user.id, twoFASecret:  code }
			})
			if (!otpCode)
				throw new NotFoundException(`Failed to disable TwoFA`);
			const setUser = await this.prisma.user.update({
				where: { id: user.id },
				data: { twoFA: false },
			});
			return setUser.twoFA;
		}
		catch (error) { // a check
			if (error instanceof ForbiddenException || error instanceof NotFoundException || error instanceof ConflictException)
				throw error
			else if (error instanceof Prisma.PrismaClientKnownRequestError)
				throw new ForbiddenException("The provided user data is not allowed")
			else
				throw new BadRequestException()
		}
	}

/* =============================== UTILS ==================================== */

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

	async setTwoFASecret(secret: string, userId: number): Promise<void> {
		try {
		const user = await this.prisma.user.update({
			where: { id: userId,},
			data: { twoFASecret: secret },
		});
		if (!user)
			throw new NotFoundException("User not found");
		} catch (error) { throw error; }
	}

	// Verifie si le code fourni est correct avec l'api de google
	async verifyCode(userTwoFASecret: string, twoFACode: string): Promise <boolean> {
		return authenticator.verify({
			token: twoFACode,
			secret: userTwoFASecret
		  });
	}
}