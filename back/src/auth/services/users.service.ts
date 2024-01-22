import { Injectable, ForbiddenException, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from '../dto/users.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClient, User, Prisma, Role, UserStatus, RequestStatus, Invitation, ChannelStatus } from '@prisma/client';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import * as argon from 'argon2';

@Injectable()
export class UsersService {
	constructor(private prisma: PrismaService) {}

	async createUser(createUserDto: CreateUserDto) {
		try {
			const userExists = await this.prisma.user.findMany({
				where: { OR: [
					{ email: createUserDto.email }, 
					{ username: createUserDto.username }
				],}
			})
			if (userExists[0])
				throw new ConflictException("User already exists");
			console.log("creating user")
			const hash = await argon.hash(createUserDto.hash);
			const user = await this.prisma.user.create({
				data: {
					username: createUserDto.username,
					hash,
					email: createUserDto.email,
					phoneNumber: createUserDto.phoneNumber || '',
					avatar: createUserDto.avatar || '',
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
		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === 'P2002')
					throw new ForbiddenException('Failed to create new user');
			}
			throw error;
		}
	}

	findAll() {
		const users = this.prisma.user.findMany({ 
			select: { id: true,
				username: true,
				avatar: true,
				status: true,
				wins: true,
				draws: true,
				losses: true,
			},});
		return users;
	}

	async findById(id: number) {
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

	async updateUser(id: number, updateUserDto: UpdateUserDto) {
		const hash = updateUserDto.hash ? await argon.hash(updateUserDto.hash) : undefined;
		const updateUser = await this.prisma.user.update({
			data: { 
			username: updateUserDto.username,
			hash: hash,
			email: updateUserDto.email,
			phoneNumber: updateUserDto.phoneNumber,
			avatar: updateUserDto.avatar,
			status: updateUserDto.status
			},
			where: { id: id },
		});
		return updateUser;
	}

	async remove(id: number) {
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

	async turnOnTwoFA(userId: number) {
		const user = this.prisma.user.update({
			where: {
			  id: userId,
			},
			data: {
			  twoFA: true,
			},
		});
		return user;
	}

	async setTwoFASecret(secret: string, userId: number) {
		const user = this.prisma.user.update({
			where: {
			  id: userId,
			},
			data: {
			  twoFASecret: secret,
			},
		});
		return user;
	}

	// retrieve all user's channels
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
