import { Injectable, ForbiddenException, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from '../dto/users.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClient, User, Prisma, Role, UserStatus, RequestStatus, Invitation } from '@prisma/client';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import * as argon from 'argon2';
import { authenticator } from "otplib";

@Injectable()
export class UsersService {
	constructor(private prisma: PrismaService) {}

	/*********************** General CRUD ******************************************/

	async createUser(createUserDto: CreateUserDto) {
		try {
			const userExists = await this.prisma.user.findMany({
				where: { OR: [
					{ email: createUserDto.email }, 
					{ username: createUserDto.username }
				],}
			})
			if (userExists[0])
				throw new BadRequestException("User already exists");
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

	async remove(id: number) {
		const deleteFriends =  this.prisma.relations.deleteMany({
			where: { hasRelationsId: id }});
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
		const setUser = await this.prisma.user.findUnique({ where: {id: user.id}});
		if (!setUser)
			throw new NotFoundException('User not found');
		if (setUser.twoFA)
			throw new BadRequestException('2FA already enabled');

		const isCodeValid = authenticator.verify({
			token: twoFACode,
			secret: setUser.twoFASecret,
		});
		if (!isCodeValid)
			throw new UnauthorizedException('Wrong authentication code');
		await this.prisma.user.update({
			where: { id: user.id, },
			data: { twoFA: true, },
		});
		return user;

	}

	async setTwoFASecret(secret: string, userId: number) {
		try {
		const user = this.prisma.user.update({
			where: { id: userId, twoFA: true },
			data: { twoFASecret: secret,
					twoFA: true },
		});
		if (!user)
			throw new NotFoundException(`User with ${userId} does not exist.`);
		return user;
		} catch (error) { throw error; }
	}

	async disableTwoFA(user: User, code: string) {
		  const otpCode = await this.prisma.user.findUnique({
			where: { id: user.id, twoFASecret:  code }
		  })
		  await this.prisma.user.update({
			where: { id: user.id },
			data: { twoFA: false },
		  });
	}

	/*********************** Channels ******************************************/

	async findUserChannel(member: User) {

		const channelsId = await this.prisma.usersOnChannels.findMany({
			where: { userId: member.id }})

		const userChannels = await this.prisma.channel.findMany({
			where: {
				id: { in: channelsId.map((channelId) => (channelId.channelId)) }
			}
		})
		return userChannels;
	}
}
