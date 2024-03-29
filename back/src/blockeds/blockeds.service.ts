import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
// import { RelationDto } from './dto/blockeds.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClient, User, Prisma, Role, UserStatus, RequestStatus } from '@prisma/client';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ChannelsService } from 'src/channels/channels.service';

@Injectable()
export class BlockedsService {
	constructor(private prisma: PrismaService,
		private channelService: ChannelsService) {}

	// Bloque un user
	async addBlocked(userAuthId: number, userTargetId: number) {
		try {
			// Verifie si le user target n'est pas le user auth
			if (userAuthId === userTargetId)
				throw new ForbiddenException("Unauthorized to block yourself")
			
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

			// Verifie si le user target n'est pas déjà bloqué
			const isBlocked = !!await this.prisma.blocked.findUnique({
				where: {
					userId_blockedId:
					{
						userId: userAuthId,
						blockedId: userTargetId
					}
				}
			})
			if (isBlocked)
				throw new ConflictException(`${userTarget.username} is already blocked`)

			// Bloque le user target
			const newBlocked = await this.prisma.user.update({
				where: {
					id: userAuthId
				},
				data: {
					blockeds: {
						create: [{
							blockedId: userTargetId
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

			// Verifie si un channel MP existe et le supprime
			const channelMP = await this.channelService.findChannelMP(userAuthId, userTargetId)
			if (channelMP)
				await this.channelService.remove(channelMP.id)

			console.log(`User ${userAuthId} blocked user ${userTargetId}`)
			return newBlocked
		}
		catch (error) {
			if (error instanceof ForbiddenException || error instanceof NotFoundException || error instanceof ConflictException)
				throw error
			else if (error instanceof Prisma.PrismaClientKnownRequestError)
				throw new ForbiddenException("The provided credentials are not allowed")
			else
				throw new BadRequestException()
		}
	}

	// Retourne les users bloques
	async getUserBlockeds(userId: number) {
		try {
			// Retourne les relations blockeds du user
			const relations = await this.prisma.user.findUnique({
				where: {
					id: userId
				},
				select: {
					blockeds: {
						select: {
							blockedId: true
						}
					}
				}
			})

			// Retourne les ids des users bloques pqr le user
			const blockedsIds = relations.blockeds.map((relation) => relation.blockedId)

			// Retourne les users bloques avec leurs donnees publiques
			const blockeds = await this.prisma.user.findMany({
				where: {
					id: {
						in: blockedsIds
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

			return blockeds
		}
		catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError)
				throw new ForbiddenException("The provided credentials are not allowed")
			else
				throw new BadRequestException()
		}
	}

	// Debloque un user
	async removeBlocked(userAuthId: number, userTargetId: number) {
		try {
			// Verifie si le user target n'est pas le user auth
			if (userAuthId === userTargetId)
				throw new ForbiddenException("Unauthorized to unblock yourself")

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
	
			// Verifie si le user target n'est pas déjà bloqué
			const isBlocked = !!await this.prisma.blocked.findUnique({
				where: {
					userId_blockedId:
					{
						userId: userAuthId,
						blockedId: userTargetId
					}
				}
			})
			if (!isBlocked)
				throw new NotFoundException(`${userTarget.username} is not blocked`)
	
			// Débloque le user target
			await this.prisma.blocked.delete({
				where: {
					userId_blockedId: {
						userId: userAuthId,
						blockedId: userTargetId
					}
				}
			})

			console.log(`User ${userAuthId} has unblocked user ${userTargetId}`)
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

// async getBlockeds(userId: number) {
// 	const user = await this.prisma.user.findFirst({ 
// 		where: { id: userId },
// 		include: { blockeds: true, },
// 	})
// 	return user;
// }

	// OK de passer RelationDTO en parametre ?
	// async updateRelation(userId: number, dto: RelationDto) {
	// 	if (userId === dto.isInRelationsId)
	// 		return { error: 'user has same id as blocked' };
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
	// 			return { error: 'An error occurred while removing blocked' };
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

	// async sendBlockedRequest(receiverId: number, sender: User): Promise<Relations | { error: string }> {
	// 	if (receiverId === sender.id)
	// 		return { error: 'It is not possible to add yourself!' };

	// 	try {
	// 		const receiver: User = await this.prisma.user.findUnique({where: { id: receiverId }});
	// 		if (!receiver)
	// 			throw new NotFoundException(`User with ${receiverId} does not exist.`);
			
	// 		const isSent: boolean = await this.isSent(sender, receiver);
	// 		if (isSent === true)
	// 			return { error: 'A blocked request has already been sent or received to your account!' };

	// 		// const blockedRequest = await this.prisma.user.create({
	// 		// 	data: { hasRelationsId: sender.id,
	// 		// 	isInRelationsId: receiver.id,
	// 		// 	request: 'PENDING', }
	// 		// 	});
	// 		// return blockedRequest;
	// 	} catch (error) {
	// 		if (error instanceof Prisma.PrismaClientKnownRequestError)
	// 			return { error: 'An error occurred while processing the blocked request.' };
	// 		throw error;
	// 	}
	// }

	// async getBlockedRequestStatus(isBlockedId: number, currentUser: User): Promise<RequestStatus | { error: string }> {
	// 	const receiver = await this.prisma.user.findUnique({
	// 		where: { id: isBlockedId },
	// 	})
	// 	const blockedRequest = await this.prisma.relations.findUnique({
	// 		where : { hasRelationsId_isInRelationsId: {
	// 			hasRelationsId: currentUser.id,
	// 			isInRelationsId: receiver.id,
	// 			}}
	// 	})
	// 	if (blockedRequest)
	// 		return blockedRequest.request; 
	// 	return { error : 'blocked request not sent'};
	// }