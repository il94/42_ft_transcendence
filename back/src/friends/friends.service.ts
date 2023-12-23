import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFriendDto, UpdateFriendDto } from './dto/friends.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClient, User, Prisma, Role, UserStatus, Friends, RequestStatus, Invitation } from '@prisma/client';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

@Injectable()
export class FriendsService {
  constructor(private prisma: PrismaService) {}

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

  create(createFriendDto: CreateFriendDto) {
    return 'This action adds a new friend';
  }

  findAll() {
    return `This action returns all friends`;
  }

  findOne(id: number) {
    return `This action returns a #${id} friend`;
  }

  update(id: number, updateFriendDto: UpdateFriendDto) {
    return `This action updates a #${id} friend`;
  }

  remove(id: number) {
    return `This action removes a #${id} friend`;
  }
}
