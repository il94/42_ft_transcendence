import { Injectable, ForbiddenException, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClient, User, Prisma, Role, UserStatus, Friends, RequestStatus, Invitation } from '@prisma/client';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import * as argon from 'argon2';
import { from, Observable, of, throwError } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable()
export class UsersService {
	constructor(private prisma: PrismaService) {}

	async createUser(createUserDto: CreateUserDto) {
		try {
			const userExists = await this.prisma.user.findUnique({
				where: { email: createUserDto.email },
			})
			if (userExists)
				throw new BadRequestException("User already exists");
			const hash = await argon.hash(createUserDto.hash);
			let avatar = process.env.AVATAR;
			if (createUserDto.avatar) { avatar = createUserDto.avatar };
			const user = await this.prisma.user.create({
				data: {
					email: createUserDto.email,
					hash,
					avatar,
					username: createUserDto.username,
					status: UserStatus.ONLINE,
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
					email: true,			 
			},});
		return users;
	}

	async findById(id: number) {
		const user = await this.prisma.user.findUnique({
			where: { id: id },
			select: {  id: true,
				  username: true,
				  avatar: true,
				  status: true, }})
		if (!user)
			throw new NotFoundException(`User with ${id} does not exist.`);
		return user;
	}

	async updateStatus(id: number, updateUserDto: UpdateUserDto) {

	}

	async update(id: number, updateUserDto: UpdateUserDto) {
		//authenticate
		const hash = await argon.hash(updateUserDto.hash);
		const updateUser = await this.prisma.user.update({
			data: { 
			email: updateUserDto.email,
			username: updateUserDto.username,
			avatar: updateUserDto.avatar,
			hash,
			tel: updateUserDto.tel },
			where: { id: id},
		});
		return updateUser;
	}

	remove(id: number) {
		const deleteUser = this.prisma.user.delete({
			where: { id: id },
		});
		return deleteUser;
	}

	async isSent(sender: User, receiver: User) {
		const request = await this.prisma.friends.findUnique({
			where: { hasFriendsId_isFriendId: {
				hasFriendsId: sender.id,
				isFriendId: receiver.id,
				}}
		})
		if (!request)
			return false;
		return true;
	} 

	async addFriend(userId: number, friendId: number) 
	{
		if (userId === friendId) 
			return { error: 'It is not possible to add yourself!' };
		try {
			const friend: User = await this.prisma.user.findUnique({where: { id: friendId }});
		if (!friend)
			throw new NotFoundException(`User with id ${friendId} does not exist.`);
		
		const isFriend  =  await this.prisma.friends.findUnique({
			where: { hasFriendsId_isFriendId: {
				hasFriendsId: userId,
				isFriendId: friendId,}}
			})
		if (isFriend)
			return { error: `User with id ${friendId} is already your friend.` };

		const newFriend = await this.prisma.friends.create({
			data: { hasFriendsId: userId,
			isFriendId: friendId,
			request: 'ACCEPTED', }
			});
		return newFriend;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError)
				return { error: 'An error occurred while addind friend' };
			throw error;
		}
	}

	async sendFriendRequest(receiverId: number, sender: User): Promise<Friends | { error: string }> {
		if (receiverId === sender.id)
			return { error: 'It is not possible to add yourself!' };

		try {
			const receiver: User = await this.prisma.user.findUnique({where: { id: receiverId }});
			if (!receiver)
				throw new NotFoundException(`User with ${receiverId} does not exist.`);
			
			const isSent: boolean = await this.isSent(sender, receiver);
			if (isSent === true)
				return { error: 'A friend request has already been sent or received to your account!' };

			const friendRequest = await this.prisma.friends.create({
				data: { hasFriendsId: sender.id,
				isFriendId: receiver.id,
				request: 'PENDING', }
				});
			return friendRequest;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError)
				return { error: 'An error occurred while processing the friend request.' };
			throw error;
		}
	}

	async getFriendRequestStatus(isFriendId: number, currentUser: User): Promise<RequestStatus | { error: string }> {
		const receiver = await this.prisma.user.findUnique({
			where: { id: isFriendId },
		})
		const friendRequest = await this.prisma.friends.findUnique({
			where : { hasFriendsId_isFriendId: {
				hasFriendsId: currentUser.id,
				isFriendId: receiver.id,
				}}
		})
		if (friendRequest)
			return friendRequest.request; 
		return { error : 'friend request not sent'};
	}

	async getFriends(userId: number) {
		const user = await this.prisma.user.findFirst({ 
			where: { id: userId },
			include: { hasFriends: true, },
		})
		return user;
	}

	async getUserFriends(userId: number) {
		const friends = await this.prisma.friends.findMany({
			where: { hasFriendsId: userId }
		})
		return friends;
	}

	async getNonFriends(UserId: number) {
		//TODO ?
	}

	async removeFriend(userId: number, friendId: number) {
		if (userId === friendId)
			return { error: 'user has same id as friend' };
		try {
			const result = await this.prisma.user.update({ 
				where: { id: userId, },
				data: {
					hasFriends: {
						disconnect: [{ hasFriendsId_isFriendId: {
							hasFriendsId: userId,
							isFriendId: friendId,
							} }],
					}
				}})
			return result;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError)
				return { error: 'An error occurred while removing friend' };
			throw error;
		}
	}

}
