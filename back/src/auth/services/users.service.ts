import { Injectable, ForbiddenException, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from '../dto/users.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClient, User, Prisma, Role, UserStatus, RequestStatus, Invitation } from '@prisma/client';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import * as argon from 'argon2';

@Injectable()
export class UsersService {
	constructor(private prisma: PrismaService) {}

	async createUser(createUserDto: CreateUserDto) {
		try {
			const userExists = await this.prisma.user.findMany({
				where: { OR: [
					{
						email: createUserDto.email
					}, 
					{
						username: createUserDto.username 
					}
				],}
			})
			if (userExists[0])
				throw new BadRequestException("User already exists");
			console.log("HERE")
			const hash = await argon.hash(createUserDto.hash);
			const user = await this.prisma.user.create({
				data: {
					username: createUserDto.username,
					hash,
					email: createUserDto.email,
					phoneNumber: createUserDto.phoneNumber,
					twoFA: false,
					twoFASecret: "string",
					avatar: createUserDto.avatar,
					status: UserStatus.ONLINE,
					wins: 0,
					draws: 0,
					losses: 0,
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

	async updateStatus(id: number, updateUserDto: UpdateUserDto) {

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
			},
			where: { id: id },
		});
		return updateUser;
	}

	remove(id: number) {
		const deleteUser = this.prisma.user.delete({
			where: { id: id },
		});
		return deleteUser;
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
			where: { userId: member.id }
		})

		const userChannels = await this.prisma.channel.findMany({
			where: {
				id: { in: channelsId.map((channelId) => (channelId.channelId)) }
			}
		})
		
		return userChannels;
	}
}
