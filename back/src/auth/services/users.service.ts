import { Injectable, ForbiddenException, NotFoundException, BadRequestException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from '../dto/users.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClient, User, Prisma, Role, UserStatus, RequestStatus, Invitation, ChannelStatus } from '@prisma/client';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import * as argon from 'argon2';
import { authenticator } from "otplib";

@Injectable()
export class UsersService {
	constructor(private prisma: PrismaService) {}

	/*********************** General CRUD ******************************************/

	async createUser(createUserDto: CreateUserDto): Promise<User> {
		console.log("back create user")
		try {
			if (createUserDto.email.endsWith("@student.42.fr"))
				throw new ForbiddenException();
			const userExists = await this.prisma.user.findFirst({
				where: { email: createUserDto.email }
			})
			if (userExists)

				throw new ConflictException('credential already taken');
			const hash = await argon.hash(createUserDto.hash);
			const userDatas = {
				...createUserDto,
				hash: hash
			}
			const user = await this.prisma.user.create({
				data: {
					...userDatas,
					phoneNumber: createUserDto.phoneNumber || '',
					twoFA: false,
					twoFASecret: "",
					status: UserStatus.ONLINE,
					wins: 0,
					draws: 0,
					losses: 0
				},
			});
            console.log(`User ${user.username} with id ${user.id} created successfully`);
			return user;
		}
		catch (error) {
			throw error;
		}
	}

	// Renvoie tout les users
	findAll() {
		try {
			// Récupère tout les users
			const users = this.prisma.user.findMany({
				select: {
					id: true,
					username: true,
					avatar: true,
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
				throw new ForbiddenException("The provided user data is not allowed")
			else
				throw new BadRequestException()
		}
	}

	async findById(id: number): Promise<Partial<User>>  {
		const user = await this.prisma.user.findUnique({
			where: { id: id },
			select: {  id: true,
				  username: true,
				  avatar: true,
				  status: true,
				  wins: true,
				  draws: true,
				  losses: true, }})
		if (!user)
			throw new NotFoundException(`User with ${id} does not exist.`);
		return user;
	}

	async findUser(id: number): Promise<User>  {
		const user = await this.prisma.user.findUnique({
			where: { id: id },})
		if (!user)
			throw new NotFoundException(`User with ${id} does not exist.`);
		return user;
	}

  	// Modifie le user authentifie
	async updateUser(userId: number, updateUserDto: UpdateUserDto)  {
		try {
			if (updateUserDto.email && updateUserDto.email.endsWith("@student.42.fr"))
				throw new ForbiddenException("42 emails are forbidden")

			const hash = updateUserDto.hash ? await argon.hash(updateUserDto.hash) : null

			const userNewDatas = hash ? {
				...updateUserDto,
				hash: hash
			} : updateUserDto

			// Modifie le user auth
			await this.prisma.user.update({
				where: {
					id: userId
				},
				data: {
					...userNewDatas
				}
			})

			console.log(`User ${userId} has been updated`)
		}
		catch (error) {
			if (error instanceof ForbiddenException)
				throw error
			else if (error instanceof Prisma.PrismaClientKnownRequestError)
				throw new ForbiddenException("The provided user data is not allowed")
			else
				throw new BadRequestException()
		}
	}

	async remove(id: number): Promise<User> {
		const deleteFriends =  this.prisma.friend.deleteMany({
			where: { userId: id }});
		const deleteChannels = this.prisma.usersOnChannels.deleteMany({
			where: { userId: id }})
		const deleteGames = this.prisma.usersOnGames.deleteMany({
			where: { userId: id }})
		const transaction = await this.prisma.$transaction([deleteFriends, deleteChannels, deleteGames])
		
		const userExists = await this.prisma.user.findUnique({
			where: { id: id },});
		if (userExists) {
			const deleteUser = this.prisma.user.delete({
				where: { id: id },});
			return deleteUser;
		} else {
			throw new Error(`User with ID ${id} not found`);
		}
	}

	/*********************** TwoFA settings ******************************************/

	async turnOnTwoFA(user: User, twoFACode: string) {
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
			await this.prisma.user.update({
				where: { id: user.id, },
				data: { twoFA: true, },
			});
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

	/*********************** Channels ******************************************/

	async findUserChannel(member: User) {

		const channelsId = await this.prisma.usersOnChannels.findMany({
			where: {
				userId: member.id,
				role: {
					not: Role.BANNED
				}
			}
		})

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
								avatar: true
							}
						},
					}
				}
			}
		})

		const userAllChannels = [
			...userChannels,
			...userChannelsMP.map((channelMP) => {
				const { users, ...rest } = channelMP

				return {
					...rest,
					name: users.find((user) => user.user.id !== member.id).user.username,
					avatar: users.find((user) => user.user.id !== member.id).user.avatar
				}
			})
		]

		return userAllChannels;
	}
}
