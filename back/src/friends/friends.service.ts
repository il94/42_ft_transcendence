import { Injectable, NotFoundException } from '@nestjs/common';
import { RelationDto } from './dto/friends.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClient, User, Prisma, Role, UserStatus, Relations, RequestStatus, RelationStatus } from '@prisma/client';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

@Injectable()
export class FriendsService {
  constructor(private prisma: PrismaService) {}

	async addFriend(userId: number, friendId: number) 
	{
		if (userId === friendId) 
			return { error: 'It is not possible to add yourself!' };
		
		try {
			const friend: User = await this.prisma.user.findUnique({where: { id: friendId }});
			if (!friend)
				throw new NotFoundException(`User with id ${friendId} does not exist.`);
		
			const isFriend  =  await this.prisma.relations.findUnique({
				where: { hasRelationsId_isInRelationsId: {
					hasRelationsId: userId,
					isInRelationsId: friendId,}}
				})
			if (isFriend && isFriend.RelationType == RelationStatus.FRIEND)
				return { error: `User with id ${friendId} is already your friend.` };
			if (isFriend && isFriend.RelationType == RelationStatus.BLOCKED) {
				isFriend.RelationType = RelationStatus.FRIEND;
				return isFriend;
			}
			const newFriend = await this.prisma.user.update({where: { id: userId},
				data: { 
					hasRelations: {
						connect: [{ hasRelationsId_isInRelationsId: {
							hasRelationsId: userId,
							isInRelationsId: friendId,
							} }],
						create: [{ isInRelationsId: friendId, 
							request: RequestStatus.ACCEPTED,
							RelationType: RelationStatus.FRIEND }]
					}}
				
			})
			return newFriend;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError)
				return { error: 'An error occurred while addind friend' };
			throw error;
		}
	}

	async getFriends(userId: number) {
		const user = await this.prisma.user.findFirst({ 
			where: { id: userId },
			include: { hasRelations: true, },
		})
		return user;
	}

	async getUserFriends(userId: number) {
		const friends = await this.prisma.relations.findMany({
			where: { hasRelationsId: userId }
		})
		return friends;
	}

	async getNonFriends(UserId: number) {
		//TODO ?
	}

	// OK de passer RelationDTO en parametre ?
	async updateRelation(userId: number, dto: RelationDto) {
		if (userId === dto.isInRelationsId)
			return { error: 'user has same id as friend' };
		try {
			const change = await this.prisma.user.update({
				where: { id: userId },
				data: { hasRelations: 
					{ update: [{
						data: { RelationType: dto.RelationType },
						where: { hasRelationsId_isInRelationsId: 
							{ hasRelationsId: userId,
							isInRelationsId: dto.isInRelationsId, }
						}
					}]
				}}
			})
			return change;
		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError)
				return { error: 'An error occurred while removing friend' };
			throw error;
		}
	}

	async removeFriend(userId: number, friendId: number) {
		if (userId === friendId)
			return { error: 'user has same id as friend' };
		try {
			const result = await this.prisma.user.update({ 
				where: { id: userId, },
				data: {
					hasRelations: {
						disconnect: [{ hasRelationsId_isInRelationsId: {
							hasRelationsId: userId,
							isInRelationsId: friendId,
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

	async isSent(sender: User, receiver: User) {
		const request = await this.prisma.relations.findUnique({
			where: { hasRelationsId_isInRelationsId: {
				hasRelationsId: sender.id,
				isInRelationsId: receiver.id,}}
			})
		if (!request)
			return false;
		return true;
	} 

	async sendFriendRequest(receiverId: number, sender: User): Promise<Relations | { error: string }> {
		if (receiverId === sender.id)
			return { error: 'It is not possible to add yourself!' };

		try {
			const receiver: User = await this.prisma.user.findUnique({where: { id: receiverId }});
			if (!receiver)
				throw new NotFoundException(`User with ${receiverId} does not exist.`);
			
			const isSent: boolean = await this.isSent(sender, receiver);
			if (isSent === true)
				return { error: 'A friend request has already been sent or received to your account!' };

			// const friendRequest = await this.prisma.user.create({
			// 	data: { hasRelationsId: sender.id,
			// 	isInRelationsId: receiver.id,
			// 	request: 'PENDING', }
			// 	});
			// return friendRequest;
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
		const friendRequest = await this.prisma.relations.findUnique({
			where : { hasRelationsId_isInRelationsId: {
				hasRelationsId: currentUser.id,
				isInRelationsId: receiver.id,
				}}
		})
		if (friendRequest)
			return friendRequest.request; 
		return { error : 'friend request not sent'};
	}

}
