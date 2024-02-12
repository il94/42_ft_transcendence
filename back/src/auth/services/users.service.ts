import { Injectable, ForbiddenException, NotFoundException, BadRequestException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from '../dto/users.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClient, User, Prisma, Role, UserStatus, Game, ChannelStatus, UsersOnGames, MatchResult, roleInGame, GameStatus } from '@prisma/client';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import * as argon from 'argon2';
import { authenticator } from "otplib";
import * as fs from 'fs';
import { AppGateway } from 'src/app.gateway';
import { join } from 'path';
import { mkdir } from 'fs/promises';
import { Blob } from 'buffer';
import axios from 'axios';

@Injectable()
export class UsersService {
	constructor(private prisma: PrismaService,
				private appGateway: AppGateway) {}

	// Upload un avatar
	async uploadAvatar(link: string) {
		try {
			// console.log("00000000000000")
			// const response = await axios.get(`${link}`, {
			// 	responseType: 'stream',
			// });
			// console.log("11111111111111111111")
			
			// console.log("1")
			// let dest = "uploads/users/test"

			// const writer = fs.createWriteStream(dest);
			// console.log("2")

			// response.data.pipe(writer);
			// console.log("3")

			// await new Promise((resolve, reject) => {
			//   writer.on('finish', resolve);
			//   writer.on('error', reject);
			// });
			// console.log("3")
	  

			// console.log(avatar)
			// response.data.pipe(writer);


		} catch (error) {

			// console.log("ERROR", error);

			if (error instanceof NotFoundException)
				throw error
			else if (error instanceof Prisma.PrismaClientKnownRequestError)
				throw new ForbiddenException("The provided credentials are not allowed")
			else
				throw new BadRequestException()
		}
	}

	// Cree un user
	async createUser(userDatas: CreateUserDto, file?: Express.Multer.File): Promise<User> {
		try {

			console.log("userdatas", userDatas)

			// Verifie si le username n'est pas deja pris
			const userExists = await this.prisma.user.findFirst({
				where: {
					username: userDatas.username
				}
			})
			if (userExists)
			{
				console.log("DANS LE IF", userExists)
				throw new ConflictException("Username already exists")
			}

			// Hashe le mot de passe
			const hash = await argon.hash(userDatas.hash)

			// Remplace le mot de passe par sa version hashee
			const user = {
				...userDatas,
				hash: hash
			}

			// Cree le nouvel user
			const newUser = await this.prisma.user.create({
				data: {
					...user,
					twoFA: false,
					twoFASecret: "",
					status: UserStatus.ONLINE,
					wins: 0,
					draws: 0,
					losses: 0
				},
			})

			console.log("AVANT IF")
			if (file)
			{
				await this.saveUserAvatar(newUser.id, file)
				console.log("if")

			}
			else
			{
				console.log("else")

				await this.getRandomAvatar(newUser.id)
			}

			console.log("APRES IF")

			console.log(`User ${newUser.id} was created`)
			return newUser
		}
		catch (error) {

			console.log(error)

			if (error instanceof ConflictException)
				throw error
			else if (error instanceof Prisma.PrismaClientKnownRequestError)
				throw new ForbiddenException("The provided credentials are not allowed")
			else
				throw new BadRequestException()
		}
	}

	// Renvoie les donnees publiques de tout les users
	async findAll() {
		try {
			// Récupère tout les users
			const users = await this.prisma.user.findMany({
				select: {
					id: true,
					username: true,
					// avatar: true,
					status: true,
					wins: true,
					draws: true,
					losses: true
				}
			})
			return users
		}
		catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError)
				throw new ForbiddenException("The provided credentials are not allowed")
			else
				throw new BadRequestException()
		}
	}

	// Renvoie les donnees publiques d'un user
	async findById(userId: number): Promise<Partial<User>>  {
		try {
			const user = await this.prisma.user.findUnique({
				where: {
					id: userId
				},
				select: {
					id: true,
					username: true,
					// avatar: true,
					status: true,
					wins: true,
					draws: true,
					losses: true
				}
			})
			if (!user)
				throw new NotFoundException("User not found")
			return user
		}
		catch (error) {
			if (error instanceof NotFoundException)
				throw error
			else if (error instanceof Prisma.PrismaClientKnownRequestError)
				throw new ForbiddenException("The provided credentials are not allowed")
			else
				throw new BadRequestException()
		}
	}

	// Renvoie les channels du user auth sauf ceux dans lesquels il est ban
	async findUserChannel(userId: number) {
		try {
			// Recupere les ids des channels du user
			const channelsId = await this.prisma.usersOnChannels.findMany({
				where: {
					userId: userId,
					role: {
						not: Role.BANNED
					}
				},
				select: {
					channelId: true
				}
			})

			// Recupere les channels par leurs ids sauf les MP
			const userChannels = await this.prisma.channel.findMany({
				where: {
					id: {
						in: channelsId.map((channelId) => (channelId.channelId))
					},
					AND: {
						type: {
							in: [ChannelStatus.PUBLIC, ChannelStatus.PROTECTED, ChannelStatus.PRIVATE]
						}
					}
				}
			})

			// Recupere les channels MP par leurs ids
			const userChannelsMP = await this.prisma.channel.findMany({
				where: {
					id: {
						in: channelsId.map((channelId) => (channelId.channelId))
					},
					AND: {
						type: ChannelStatus.MP
					}
				},
				include: {
					users: {
						select: {
							user: {
								select: {
									id: true,
									username: true,
									// avatar: true
								}
							},
						}
					}
				}
			})

			// Regroupe les channels et MPs avec les bonnes datas
			const userAllChannels = [
				...userChannels,
				...userChannelsMP.map((channelMP) => {
					const { users, ...rest } = channelMP

					return {
						...rest,
						name: users.find((user) => user.user.id !== userId).user.username,
						// avatar: users.find((user) => user.user.id !== userId).user.avatar
					}
				})
			]

			return userAllChannels
		}
		catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError)
				throw new ForbiddenException("The provided credentials are not allowed")
			else
				throw new BadRequestException()
		}
	}

  // historique de matches du user (retourne null si aucun matchs joues)
	async getMatchHistory(userId: number): Promise<Array<any>> {
		try {
			const matchTab = await this.prisma.usersOnGames.findMany({ where: { userId: userId, role: roleInGame.PLAYER }})
				if (!matchTab)
					return null;
			let tab: any[] = [];
			for (let i = 0; i < matchTab.length; i++) {
				const challengerData = await this.getChallenger(matchTab[i].gameId, userId);
				if (challengerData)
					tab.push({match: matchTab[i], challengerData})
			}
			const res = tab;
			return res;
		} catch (error) {
			throw error;
		}
	}

  	// Modifie le user authentifie
	async updateUser(userId: number, updateUserDto: UpdateUserDto, file?: Express.Multer.File)  {
		try {
			const userNewDatas = {
				...updateUserDto,
				hash: updateUserDto.hash ? await argon.hash(updateUserDto.hash) : undefined,
			}

			// Modifie le user auth
			await this.prisma.user.update({
				where: {
					id: userId
				},
				data: {
					...userNewDatas
				}
			})

			if (file)
				await this.saveUserAvatar(userId, file)

			const newDatasToEmit = {
				username: updateUserDto.username
			}

			// Emit
			this.appGateway.server.emit("updateUserDatas", userId, newDatasToEmit)
			console.log(`User ${userId} has been updated`)
		}
		catch (error) {

			console.log(error)

			if (error instanceof Prisma.PrismaClientKnownRequestError)
				throw new ForbiddenException("The provided credentials are not allowed")
			else
				throw new BadRequestException()
		}
	}

/* =============================== UTILS ==================================== */

	async getChallenger(gameId: number, userId: number): Promise <{challenger: string, challengerScore: number}> {
		const game = await this.prisma.game.findFirst({ where: { AND: [ {id: gameId}, {status: GameStatus.FINISHED} ] },
			include: { 
				players: { where: { role: roleInGame.PLAYER, userId: { not: userId } },
				}}
		})
		const res: {challenger: string, challengerScore: number, challengerId: number } = {
			challengerId: -1,
			challenger: null,
			challengerScore: 0
		  };
		if (game) {
			for (let i = 0; i < game.players.length; i++) {
				const challenger = await this.prisma.user.findUnique({ 
					where: { id: game.players[i].userId },
					select: { id: true, username: true }
				})
				res.challenger = challenger.username;
				res.challengerId = challenger.id;
				const score  = await this.prisma.usersOnGames.findFirst({ 
					where: { gameId: gameId, userId: challenger.id},
					select: { score: true, gameId: true }})
				res.challengerScore = score.score;
			}
			return res;
		} 
		return null;
	}

	async saveUserAvatar(userId: number, file: Express.Multer.File) {
	
		const uploadUserPath = "/app/uploads/users/"
		if (!fs.existsSync(uploadUserPath))
            await mkdir(uploadUserPath, { recursive: true })

			await fs.promises.writeFile(uploadUserPath + userId.toString() + '_', file.buffer)
	}

	async getRandomAvatar(userId: number) {
	
		const randomAvatarsPath = "/app/defaultUserAvatars/"

		const avatarsList = await fs.promises.readdir(randomAvatarsPath)

		const randomIndex = Math.floor(Math.random() * avatarsList.length)
		const randomAvatar = await fs.promises.readFile(randomAvatarsPath + avatarsList[randomIndex])

		const uploadUserPath = "/app/uploads/users/"
		if (!fs.existsSync(uploadUserPath))
            await mkdir(uploadUserPath, { recursive: true })

		await fs.promises.writeFile(uploadUserPath + userId.toString() + '_', randomAvatar)
	}

/* =========================== PAS UTILISEES ================================ */

	// async findUser(id: number): Promise<User>  {
	// 	const user = await this.prisma.user.findUnique({
	// 		where: { id: id },})
	// 	if (!user)
	// 		throw new NotFoundException(`User with ${id} does not exist.`);
	// 	return user;
	// }

	// async remove(id: number): Promise<User> {
	// 	const deleteFriends =  this.prisma.friend.deleteMany({
	// 		where: { userId: id }});
	// 	const deleteChannels = this.prisma.usersOnChannels.deleteMany({
	// 		where: { userId: id }})
	// 	const deleteGames = this.prisma.usersOnGames.deleteMany({
	// 		where: { userId: id }})
	// 	const transaction = await this.prisma.$transaction([deleteFriends, deleteChannels, deleteGames])
		
	// 	const userExists = await this.prisma.user.findUnique({
	// 		where: { id: id },});
	// 	if (userExists) {
	// 		const deleteUser = this.prisma.user.delete({
	// 			where: { id: id },});
	// 		return deleteUser;
	// 	} else {
	// 		throw new Error(`User with ID ${id} not found`);
	// 	}
	// }
}