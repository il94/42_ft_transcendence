import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
// import { RelationDto } from './dto/friends.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClient, User, Prisma, Role, UserStatus, RequestStatus } from '@prisma/client';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

type UserDatas = {
	id: number,
    username: string,
    // avatar: string,
    wins: number,
    draws: number,
    losses: number,
    status: UserStatus
}

@Injectable()
export class FriendsService {
	constructor(private prisma: PrismaService) {}

	// Ajoute un user en ami
	async addFriend(userAuthId: number, userTargetId: number) {
		try {		
			// Verifie si le user target n'est pas le user auth
			if (userAuthId === userTargetId)
				throw new ForbiddenException("Unauthorized to add yourself as a friend")

			// Verifie si le user target existe et récupère son username
			const userTarget = await this.prisma.user.findUnique({
				where: {
					id: userTargetId
				},
				select: {
					username: true
				}
			})
			if (!userTarget)
				throw new NotFoundException("User not found")

			// Verifie si le user target n'est pas déjà un ami
			const isFriend = !!await this.prisma.friend.findUnique({
				where: {
					userId_friendId:
					{
						userId: userAuthId,
						friendId: userTargetId
					}
				}
			})
			if (isFriend)
				throw new ConflictException(`${userTarget.username} is already your friend`)

			// Ajoute le user target en ami
			const newFriend = await this.prisma.user.update({
				where: {
					id: userAuthId
				},
				data: {
					friends: {
						create: [{
							friendId: userTargetId
						}]
					}
				},
				select: {
					id: true,
					username: true,
					avatar: true,
					wins: true,
					draws: true,
					losses: true,
					status: true
				}
			})

			console.log(`User ${userAuthId} added user ${userTargetId} in friend`)
			return newFriend
		}
		catch (error) {
			if (error instanceof ForbiddenException
				|| error instanceof NotFoundException
				|| error instanceof ConflictException)
				throw error
			else if (error instanceof Prisma.PrismaClientKnownRequestError)
				throw new ForbiddenException("The provided credentials are not allowed")
			else
				throw new BadRequestException()
		}
	}

	// Retourne les amis du user
	async getUserFriends(userId: number): Promise<UserDatas[]> {
		try {
			// Retourne les relations friends du user
			const friendsRelations = await this.prisma.user.findUnique({
				where: {
					id: userId
				},
				select: {
					friends: {
						select: {
							friendId: true
						}
					}
				}
			})

			// Retourne les ids des friends du user
			const friendsIds = friendsRelations.friends.map((relation) => relation.friendId)

			// Retourne les friends avec leurs donnees publiques
			const friends = await this.prisma.user.findMany({
				where: {
					id: {
						in: friendsIds
					}
				},
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

			// console.log(`User ${userId} friends : `, friends)
			return friends
		}
		catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError)
				throw new ForbiddenException("The provided credentials are not allowed")
			else
				throw new BadRequestException()
		}
	}

	// Supprime un ami
	async removeFriend(userAuthId: number, userTargetId: number) {
		try {
			// Verifie si le user target n'est pas le user auth
			if (userAuthId === userTargetId)
				throw new ForbiddenException("Unauthorized to remove yourself from friends")

			// Verifie si le user target existe
			const userTarget = await this.prisma.user.findUnique({
				where: {
					id: userTargetId
				},
				select: {
					username: true
				}
			})
			if (!userTarget)
				throw new NotFoundException("User not found")
	
			// Verifie si le user target n'est pas déjà un ami
			const isFriend = !!await this.prisma.friend.findUnique({
				where: {
					userId_friendId:
					{
						userId: userAuthId,
						friendId: userTargetId
					}
				}
			})
			if (!isFriend)
				throw new NotFoundException(`${userTarget.username} is not your friend`)
	
			// Supprime le user target des amis
			await this.prisma.friend.delete({
				where: {
					userId_friendId: {
						userId: userAuthId,
						friendId: userTargetId
					}
				}
			})

			console.log(`User ${userAuthId} removed user ${userTargetId} from his friends`)
		}
		catch (error) {
			if (error instanceof ForbiddenException || error instanceof NotFoundException)
				throw error
			else if (error instanceof Prisma.PrismaClientKnownRequestError)
				throw new ForbiddenException("The provided credentials are not allowed")
			else
				throw new BadRequestException()
		}
	}
}

/* =========================== PAS UTILISEES ================================ */

// async getFriends(userId: number) {
// 	const user = await this.prisma.user.findFirst({ 
// 		where: { id: userId },
// 		include: { friends: true, },
// 	})
// 	return user;
// }

// OK de passer RelationDTO en parametre ?
// async updateRelation(userId: number, dto: RelationDto) {
// 	if (userId === dto.isInRelationsId)
// 		return { error: 'user has same id as friend' };
// 	try {
// 		const change = await this.prisma.user.update({
// 			where: { id: userId },
// 			data: { hasRelations: 
// 				{ update: [{
// 					data: { relationType: dto.relationType },
// 					where: { hasRelationsId_isInRelationsId: 
// 						{ hasRelationsId: userId,
// 						isInRelationsId: dto.isInRelationsId, }
// 					}
// 				}]
// 			}}
// 		})
// 		return change;
// 	} catch (error) {
// 		if (error instanceof Prisma.PrismaClientKnownRequestError)
// 			return { error: 'An error occurred while removing friend' };
// 		throw error;
// 	}
// }

	// async isSent(sender: User, receiver: User) {
	// 	const request = await this.prisma.relations.findUnique({
	// 		where: { hasRelationsId_isInRelationsId: {
	// 			hasRelationsId: sender.id,
	// 			isInRelationsId: receiver.id,}}
	// 		})
	// 	if (!request)
	// 		return false;
	// 	return true;
	// } 

	// async sendFriendRequest(receiverId: number, sender: User): Promise<Relations | { error: string }> {
	// 	if (receiverId === sender.id)
	// 		return { error: 'It is not possible to add yourself!' };

	// 	try {
	// 		const receiver: User = await this.prisma.user.findUnique({where: { id: receiverId }});
	// 		if (!receiver)
	// 			throw new NotFoundException(`User with ${receiverId} does not exist.`);
			
	// 		const isSent: boolean = await this.isSent(sender, receiver);
	// 		if (isSent === true)
	// 			return { error: 'A friend request has already been sent or received to your account!' };

	// 		// const friendRequest = await this.prisma.user.create({
	// 		// 	data: { hasRelationsId: sender.id,
	// 		// 	isInRelationsId: receiver.id,
	// 		// 	request: 'PENDING', }
	// 		// 	});
	// 		// return friendRequest;
	// 	} catch (error) {
	// 		if (error instanceof Prisma.PrismaClientKnownRequestError)
	// 			return { error: 'An error occurred while processing the friend request.' };
	// 		throw error;
	// 	}
	// }

	// async getFriendRequestStatus(isFriendId: number, currentUser: User): Promise<RequestStatus | { error: string }> {
	// 	const receiver = await this.prisma.user.findUnique({
	// 		where: { id: isFriendId },
	// 	})
	// 	const friendRequest = await this.prisma.relations.findUnique({
	// 		where : { hasRelationsId_isInRelationsId: {
	// 			hasRelationsId: currentUser.id,
	// 			isInRelationsId: receiver.id,
	// 			}}
	// 	})
	// 	if (friendRequest)
	// 		return friendRequest.request; 
	// 	return { error : 'friend request not sent'};
	// }