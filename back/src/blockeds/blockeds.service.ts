import { Injectable, NotFoundException } from '@nestjs/common';
// import { RelationDto } from './dto/blockeds.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClient, User, Prisma, Role, UserStatus, RequestStatus } from '@prisma/client';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

@Injectable()
export class BlockedsService {
  constructor(private prisma: PrismaService) {}

	async addBlocked(userId: number, blockedId: number) 
	{
		if (userId === blockedId) 
			return { error: 'It is not possible to block yourself!' };
		
		try {
			const blocked: User = await this.prisma.user.findUnique({where: { id: blockedId }});
			if (!blocked)
				throw new NotFoundException(`User with id ${blockedId} does not exist.`);
		
			const isBlocked  =  await this.prisma.blocked.findUnique({
				where: {
					userId_blockedId:
					{
						userId: userId,
						blockedId: blockedId
					}
				}
			})

			const newBlocked = await this.prisma.user.update(
				{
					where: {
						id: userId
					},
					data: {
						blockeds: {
							create: [{
								blockedId: blockedId
							}]
						}
					}
				}
			)
			return newBlocked;

		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError)
				return { error: 'An error occurred while addind blocked' };
			throw error;
		}
	}

	async getBlockeds(userId: number) {
		const user = await this.prisma.user.findFirst({ 
			where: { id: userId },
			include: { blockeds: true, },
		})
		return user;
	}

	async getUserBlockeds(userId: number) {
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

		const blockedsIds = relations.blockeds.map((relation) => relation.blockedId)

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

		const blockedsMapped = blockeds.map((blocked) => {

			const { wins, draws, losses, ...rest } = blocked

			return {
				...rest,
				scoreResume: {
					wins,
					draws,
					losses
				}
			}
		})

		return blockedsMapped;
	}

	async getNonBlockeds(UserId: number) {
		//TODO ?
	}

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

	async removeBlocked(userId: number, blockedId: number) {
		if (userId === blockedId)
			return { error: 'user has same id as blocked' };
		try {

			const deleteBlocked = await this.prisma.blocked.delete({
				where: {
					userId_blockedId: {
						userId: userId,
						blockedId: blockedId
					}
				}
			})

			return deleteBlocked;

		} catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError)
				return { error: 'An error occurred while removing blocked' };
			throw error;
		}
	}

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

}
