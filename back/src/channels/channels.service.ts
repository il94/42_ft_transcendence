import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException, UseGuards } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChannelDto, UpdateChannelDto, AuthChannelDto, UpdateRoleDto } from './dto/';
import { Channel, User ,ChannelStatus, Role, Prisma, messageStatus, challengeStatus, UserStatus  } from '@prisma/client';
import * as argon from 'argon2';
import { JwtGuard } from 'src/auth/guards/auth.guard';
import { Socket } from 'socket.io';
import { AppService } from 'src/app.service';
import { PongGateway } from 'src/pong/pong.gateway';
import { APP_FILTER } from '@nestjs/core';

type ChannelMP = {
	id: number,
    createdAt: Date,
    name: string,
    avatar: string,
    type: ChannelStatus,
    hash: string
}

@UseGuards(JwtGuard)
@Injectable()
export class ChannelsService {
	constructor(private prisma: PrismaService,
				private pongGateway: PongGateway) {}

	// Cree un channel
	async createChannel(newChannel: CreateChannelDto, userId: number): Promise<{ id: number }> {
		try {
			// Si le channel est de type protected
			if (newChannel.type === ChannelStatus.PROTECTED)
			{
				// Si aucun mot de passe n'est fourni
				if (!newChannel.hash)
					throw new ForbiddenException("Protected channels must have a password")
				
				// Hashe le nouveau mot de passe
				else
					newChannel.hash = await argon.hash(newChannel.hash)
			}

			// Retire le mot de passe (si il y en avait un ou pas)
			else
				newChannel.hash = undefined

			// Crée le channel et renvoie son id
			const newChannelId = await this.prisma.channel.create({
				data: {
					...newChannel,
					users: { 
						create: [
							{
								role: Role.OWNER,
								user: {
									connect: {
										id: userId
									}
								}
							}
						]  
					},
				},
				select: {
					id: true
				}
			})

			console.log(`Channel ${newChannelId.id} was created`, newChannel)
			return newChannelId
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

	// Cree un channel MP et y ajoute un user
	async createChannelMP(userAuthId: number, userTargetId: number): Promise<ChannelMP> {
		try {
			// Verifie si le channel MP n'existe pas déjà
			const channelMPAlreadyExist = !!await this.prisma.channel.findFirst({
				where: {
					type: ChannelStatus.MP,
					users: {
						every: {
							OR: [{
									user: {
										id: userAuthId
									}
								},
								{
									user: {
										id: userTargetId
									}
								}
							]
						}
					}
				}
			})
			if (channelMPAlreadyExist)
				throw new ConflictException("MP channel already exist")

			// Verifie si le user target existe et retourne son id username et avatar
			const userTarget = await this.prisma.user.findUnique({
				where: {
					id: userTargetId
				},
				select: {
					id: true,
					username: true,
					avatar: true
				}
			})
			if (!userTarget)
				throw new NotFoundException("User not found")

			// Verifie si le user auth n'a pas bloque le user target
			const userTargetIsBlocked = !!await this.prisma.blocked.findUnique({
				where: {
					userId_blockedId: {
						userId: userAuthId,
						blockedId: userTargetId
					}
				}
			})
			if (userTargetIsBlocked)
				throw new ForbiddenException("You have blocked this user")

			// Verifie si le user target n'a pas bloque le user auth
			const userAuthIsBlocked = !!await this.prisma.blocked.findUnique({
				where: {
					userId_blockedId: {
						userId: userTargetId,
						blockedId: userAuthId
					}
				}
			})
			if (userAuthIsBlocked)
				throw new ForbiddenException("You are blocked")

			// Crée le nouveau channel MP sans nom ni avatar et y inclut le user target
			const newChannelMP = await this.prisma.channel.create({
				data: {
					name: '',
					avatar: '',
					type: ChannelStatus.MP,
					users: { 
						create: [
							{
								role: Role.MEMBER,
								user: {
									connect: {
										id: userAuthId
									}
								}
							},
							{
								role: Role.MEMBER,
								user: {
									connect: {
										id: userTargetId
									}
								}
							},
						]  
					},
				}
			})

			// Ajoute les données du user target pour le front
			const channelMP: ChannelMP = {
				...newChannelMP,
				name: userTarget.username,
				avatar: userTarget.avatar
			}

			// Recupere l'id username et avatar du user auth 
			const userAuth = await this.prisma.user.findUnique({
				where: {
					id: userAuthId
				},
				select: {
					id: true,
					username: true,
					avatar: true
				}
			})

			// Emit
			const socket: Socket = AppService.connectedUsers.get(userTarget.id.toString())
			socket.emit("createChannelMP", channelMP.id, userAuth)

			console.log(`Channel MP ${channelMP.id} was created`)

			console.log(channelMP)

			return channelMP
		}
		catch (error) {
			if (error instanceof NotFoundException || error instanceof ForbiddenException || error instanceof ConflictException)
				throw error
			else if (error instanceof Prisma.PrismaClientKnownRequestError)
				throw new ForbiddenException("The provided user data is not allowed")
			else
				throw new BadRequestException()
		}
	}

	// Ajoute un user dans un channel
	async joinChannel(channelId: number, userId: number, hash?: string, inviterId?: number) {
		try {
			// Verifie si le channel existe et le retourne
			const channelToJoin = await this.prisma.channel.findUnique({
				where: {
					id: channelId
				}
			})
			if (!channelToJoin)
				throw new NotFoundException("Channel not found")
			else if ((channelToJoin.type === ChannelStatus.PRIVATE ||
				channelToJoin.type === ChannelStatus.MP) && !inviterId)
				throw new ForbiddenException("You dont have permissions for this action")
			else if (channelToJoin.type === ChannelStatus.MP && inviterId)
				throw new ForbiddenException("Invitations forbidden for channel MP")

			// Verifie si le user existe et le récupère
			const user = await this.prisma.user.findUnique({
				where: {
					id: userId
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
			if (!user)
				throw new NotFoundException("User not found")

			if (inviterId)
			{
				// Verifie si le user invite n'a pas bloque le user
				const userTargetIsBlocked = !!await this.prisma.blocked.findUnique({
					where: {
						userId_blockedId: {
							userId: inviterId,
							blockedId: userId
						}
					}
				})
				if (userTargetIsBlocked)
					throw new ForbiddenException("You have blocked this user")

				// Verifie si le user n'a pas bloque le user invite
				const userAuthIsBlocked = !!await this.prisma.blocked.findUnique({
					where: {
						userId_blockedId: {
							userId: userId,
							blockedId: inviterId
						}
					}
				})
				if (userAuthIsBlocked)
					throw new ForbiddenException("You are blocked")

				// Verifie si le user qui aurait lancé l'invitation est dans le channel
				const inviter = !!await this.prisma.usersOnChannels.findUnique({
					where: {
						userId_channelId: {
							userId: inviterId,
							channelId: channelId
						}
					}
				})
				if (!inviter)
					throw new NotFoundException("User not found")
			}

			// Verifie si le user n'est pas déjà dans le channel et retourne son role
			const isInChannel = await this.prisma.usersOnChannels.findUnique({
				where: {
					userId_channelId: {
						userId: userId,
						channelId: channelId
					}
				},
				select: {
					role: true
				}
			})
			if (isInChannel)
			{
				if (isInChannel.role === Role.BANNED)
					throw new ConflictException(`${user.username} is banned from this channel`)
				else
					throw new ConflictException(`${user.username} is already in channel`)
			}

			// Si il y a un mot de passe et que le user n'a pas été invité, vérifie que le mot de passe fourni soit correct
			if (channelToJoin.hash && !inviterId)
			{
				const pwdMatch = await argon.verify(channelToJoin.hash, hash);
				if (!pwdMatch)
					throw new ForbiddenException("Incorrect password");
			}

			// Ajoute le user au channel
			await this.prisma.channel.update({
				where: {
					id: channelToJoin.id
				}, 
				data: {
					users: { 
						create: [
							{
								role: Role.MEMBER,
								user: {
									connect: {
										id: userId
									}
								}
							}
						]  
					}
				}})

				// Si le user a été invité dans le channel, emit à tout les users du channel 
				if (inviterId)
					await this.emitOnChannel("joinChannel", channelId, userId, channelToJoin, user)

				// Si le user a rejoint le channel de lui même, emit à tout les users du channel sauf lui
				else
					await this.emitOnChannelExceptUser("joinChannel", userId, channelId, userId, null, user)

				console.log(`User ${userId} joined channel ${channelId}`)
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

    /****************************** gestion message ***********************/

	// Cree un message
	async addContent(channelId: number, userId: number, msgContent: string, msgStatus: messageStatus) {
		try {
			// Verifie si le channel existe
			const channelExist = !!await this.prisma.channel.findUnique({
				where: {
					id: channelId
				}
			})
			if (!channelExist)
				throw new NotFoundException("Channel not found")

			// Verifie si le user est dans le channel et retourne ses donnees
			const userDatas = await this.prisma.usersOnChannels.findUnique({
				where: {
					userId_channelId: {
						userId: userId,
						channelId: channelId
					}
				},
				select: {
					role: true,
					mute: true
				}
			})
			if (!userDatas)
				throw new NotFoundException("User not found")
			else if (userDatas.role === Role.BANNED)
				throw new ForbiddenException("You are banned from this channel")
			else if (new Date(userDatas.mute) > new Date())
				throw new ForbiddenException("You are muted from this channel")

			// Verifie si le message n'est pas vide
			if (!msgContent)
				throw new ForbiddenException("Empty message")

			// Cree le message
			const textDatas = await this.prisma.message.create({
				data: {
					author: {
						connect: {
							id: userId
						}
					},
					channel: {
						connect: {
							id: channelId
						}
					},
					content: msgContent,
					isInvit: false,
					type: msgStatus
				}
			})

			// Emit
			await this.emitOnChannel("postText", channelId, userId, textDatas)
		}
		catch (error) {
			if (error instanceof ForbiddenException || error instanceof NotFoundException)
				throw error
			else if (error instanceof Prisma.PrismaClientKnownRequestError)
				throw new ForbiddenException("The provided user data is not allowed")
			else
				throw new BadRequestException()
		}
	}

	// Cree une invitation a jouer
	async addContentInvitation(channelId: number, userTargetId : number, userAuthId : number, msgStatus : messageStatus) {
		try {
			// Verifie si le channel existe
			const channelExist = !!await this.prisma.channel.findUnique({
				where: {
					id: channelId
				}
			})
			if (!channelExist)
				throw new NotFoundException("Channel not found")

			// Verifie si le user auth est dans le channel et retourne son role
			const userAuthRole = await this.prisma.usersOnChannels.findUnique({
				where: {
					userId_channelId: {
						userId: userAuthId,
						channelId: channelId
					}
				},
				select: {
					role: true
				}
			})
			if (!userAuthRole)
				throw new NotFoundException("User not found")
			else if (userAuthRole.role === Role.BANNED)
				throw new ForbiddenException(`You are banned from this channel`)

			// Verifie si le user target existe et retourne son username et son statut
			const userTargetDatas = await this.prisma.user.findUnique({
				where: {
					id: userTargetId
				},
				select: {
					username: true,
					status: true
				}
			})
			if (!userTargetDatas)
				throw new NotFoundException("User not found")
			else if (userTargetDatas.status === UserStatus.OFFLINE)
				throw new ConflictException(`${userTargetDatas.username} is disconnected`)

			// Verifie si le user target est dans le channel et retourne son role
			const userTargetRole = await this.prisma.usersOnChannels.findUnique({
				where: {
					userId_channelId: {
						userId: userTargetId,
						channelId: channelId
					}
				},
				select: {
					role: true
				}
			})
			if (!userTargetRole)
				throw new NotFoundException("User not found")
			else if (userTargetRole.role === Role.BANNED)
				throw new ForbiddenException(`${userTargetDatas.username} is banned from this channel`)

			// Cree l'invitation
			const invitationDatas = await this.prisma.message.create({
				data: {
					author: {
						connect: {
							id: userAuthId
						}
					},
					channel: {
						connect: {
							id: channelId
						}
					},
					isInvit: true,
					targetId: userTargetId,
					status: challengeStatus.PENDING,
					type: msgStatus
				}
			})

			await this.emitOnChannel("postInvitation", channelId, userAuthId, userTargetId, invitationDatas)
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

	// Retourne tout les channels PUBLIC et PROTECTED
	async findAllChannelsAccessibles() {
		try {
			// Récupère tout les channels publics et protecteds
			const accessibleChannels = await this.prisma.channel.findMany({
				where: {
					type: {
						in: ['PUBLIC', 'PROTECTED']
					}
				},
			})

			// console.log("Accessibles channels :", accessibleChannels)
			return accessibleChannels
		}
		catch (error) {
			if (error instanceof Prisma.PrismaClientKnownRequestError)
				throw new ForbiddenException("The provided user data is not allowed")
			else
				throw new BadRequestException()
		}
	}

	// Retourne un channel avec ses relations
	async findChannelWithRelations(chanId: number, userId: number) {
		try {
			// Récupère le channel avec toutes ses users et messages
			const channelDatas = await this.prisma.channel.findUnique({ 
				where: { 
					id: chanId
				},
				include: {
					users: {
						select: {
							user: {
								select: {
									id: true,
									username: true,
									avatar: true,
									status: true,
									wins: true,
									draws: true,
									losses : true     
								}
							},
							role: true,
               mute: true,
            }
					},
					content: {
						select: {
							id: true,
							author: {
								select: {
									id: true,
									username: true,
									avatar: true,
									status: true,
									wins: true,
									draws: true,
									losses : true 
								}
							},
							targetId: true,
							type: true,
							content: true,
							status: true
						}
					}
				}
			})
			if (!channelDatas)
				throw new NotFoundException("Channel not found")

			// Déstructure le channel afin de mapper les relations pour le front
			const { users, content, ...rest } = channelDatas

			// Récupère les relations de chaque messages du channel
			const cleanedMessages = await Promise.all(content.map(async (message) => {
				if (message.type === "TEXT") {
					const { status, author, ...rest } = message;
					return {
						...rest,
						sender: author
					};
				}
				else {
					const { author, targetId, ...rest } = message;
					const target = await this.prisma.user.findUnique({
						where: {
							id: targetId
						}
					});
					return {
						...rest,
						sender: author,
						target: target
					};
				}
			})) 

			// Pour un channel MP, ajoute les données du user qui n'est pas l'auth pour le front
			function getMPData() {
				return {
					name: channelDatas.users.find((user) => user.user.id !== userId).user.username,
					avatar: channelDatas.users.find((user) => user.user.id !== userId).user.avatar
				}
			}

			// Recupere les users mutes
			async function getUserMuted() {
				const muteInfo: Record<number, string> = {};
				for (const user of channelDatas.users)
				{
					if (user.mute !== undefined) {
						muteInfo[user.user.id] = user.mute.toISOString();
					}
				}
				return muteInfo;
			}
      
			// Objet contenant les données du channel avec ses relations
			const channelWithRelations = {

				// Données du channel
				...rest,

				// Données du channel en settant les bonnes si c'est un MP
				name: rest.type === ChannelStatus.MP ? getMPData().name : rest.name,
				avatar: rest.type === ChannelStatus.MP ? getMPData().avatar : rest.avatar,

				// Messages mappés
				messages: cleanedMessages,

				// Membres mappés
				members: channelDatas.users.map((user) => {
					if (user.role === Role.MEMBER)
					return (user.user)
				}).filter(Boolean),

				// Administrateurs mappés
				administrators: channelDatas.users.map((user) => {
					if (user.role === Role.ADMIN)
					return (user.user)
				}).filter(Boolean),
				
				// Owner mappé
				owner: channelDatas.users.find((user) => user.role === Role.OWNER)?.user,

				// Users mutes
				muteInfo: await getUserMuted(),

				// Users bannis mappés
				banneds: channelDatas.users.map((user) => {
					if (user.role === Role.BANNED)
					return (user.user)
				}).filter(Boolean)
			}

			// console.log(`Channel ${chanId} with relations :`, channelWithRelations)
			return channelWithRelations
		}
		catch (error) {
			if (error instanceof NotFoundException)
				throw error
			else if (error instanceof Prisma.PrismaClientKnownRequestError)
				throw new ForbiddenException("The provided user data is not allowed")
			else
				throw new BadRequestException()
		}
	}

	// Modifie un channel
	async updateChannel(channelId: number, newChannelDatas: UpdateChannelDto, userId: number) {
		try {
			// Verifie si le channel existe et le retourne
			const channelToUpdate = await this.prisma.channel.findUnique({
				where: {
					id: channelId
				}
			})
			if (!channelToUpdate)
				throw new NotFoundException("Channel not found")

			// Verifie si le user est dans le channel et retourne son role
			const userRole = await this.prisma.usersOnChannels.findUnique({
				where: {
					userId_channelId: {
						userId: userId,
						channelId: channelId
					}
				},
				select: {
					role: true
				}
			})
			if (!userRole)
				throw new NotFoundException("User not found")
			else if (userRole.role !== Role.OWNER)
				throw new ForbiddenException("You dont have permissions for this action")

			// Si le channel n'est pas de type protected
			if (channelToUpdate.type !== ChannelStatus.PROTECTED &&
				newChannelDatas.type !== ChannelStatus.PROTECTED)
			{
				// Si un mot de passe est fourni
				if (newChannelDatas.hash)
					throw new ForbiddenException("Only protecteds channels can have a password")

				// Retire le mot de passe (si il y en avait un ou pas)
				else
					newChannelDatas.hash = '' // chaîne vide et pas undefined pour mettre à jour la db
			}
		
			// Si le channel est de type protected
			else
			{
				// Si aucun mot de passe n'est fourni, garde l'ancien
				if (!newChannelDatas.hash)
					newChannelDatas.hash = undefined

				// Hashe le nouveau mot de passe
				else
					newChannelDatas.hash = await argon.hash(newChannelDatas.hash)
			}

			// Update le channel
			await this.prisma.channel.update({
				where: {
					id: channelToUpdate.id
				}, 
				data: {
					...newChannelDatas
				}
			})

			// Emit
			await this.emitOnChannel("updateChannel", channelId, newChannelDatas)
			console.log(`Channel ${channelId} has been updated`)
		}
		catch (error) {
			if (error instanceof ForbiddenException || error instanceof NotFoundException)
				throw error
			else if (error instanceof Prisma.PrismaClientKnownRequestError)
				throw new ForbiddenException("The provided user data is not allowed")
			else
				throw new BadRequestException()
		}
	}

	// Change le role d'un user du channel
	async updateUserRole(channelId: number, userAuthId: number, userTargetId: number, newRole: Role) {
		try {
			// Verifie si le channel existe
			const channelExist = !!await this.prisma.channel.findUnique({
				where: {
					id: channelId
				}
			})
			if (!channelExist)
				throw new NotFoundException("Channel not found")

			// Verifie si le user target n'est pas le user auth
			if (userAuthId === userTargetId)
				throw new ForbiddenException("It is not possible to update your own role")

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

			// Verifie si le user auth est dans le channel et recupere son role
			const userAuthRole = await this.prisma.usersOnChannels.findUnique({
				where: {
					userId_channelId: {
						userId: userAuthId,
						channelId: channelId
					}
				},
				select: {
					role: true
				}
			})
			if (!userAuthRole)
				throw new NotFoundException("User not found")

			// Verifie si le user target est dans le channel, recupere son role et verifie qu'il ne le possede pas deja
			const userTargetRole = await this.prisma.usersOnChannels.findUnique({
					where: {
						userId_channelId: {
							userId: userTargetId,
							channelId: channelId
						}
					},
					select: {
						role: true
					}
			})
			if (!userTargetRole)
				throw new NotFoundException("User not found")
			else if (userTargetRole.role === newRole)
				throw new ConflictException(`User is already ${newRole.toLowerCase()}`)

			// Pour un déban uniquement, vérifie si les permissions sont bonnes et supprime la relation member - channel du user target
			if (newRole === Role.UNBANNED)
			{
				if (userAuthRole.role !== Role.ADMIN && userAuthRole.role !== Role.OWNER)
					throw new ForbiddenException("You dont have permissions for this action")
				await this.prisma.usersOnChannels.delete({
					where: {
						userId_channelId: {
							userId: userTargetId,
							channelId: channelId
						}
					}
				})
			}
			// Pour les autres rôles, vérifie si les permissions sont bonnes et patch la relation member - channel du user target
			else
			{
				if (((newRole === Role.ADMIN || newRole === Role.MEMBER)
					&& userAuthRole.role !== Role.OWNER) ||
						newRole === Role.BANNED && userAuthRole.role !== Role.OWNER && userAuthRole.role !== Role.ADMIN)
				throw new ForbiddenException("You dont have permissions for this action")

				await this.prisma.usersOnChannels.update({
					where: {
						userId_channelId: {
							userId: userTargetId,
							channelId: channelId
						}
					},
					data: {
						role: newRole
					}
				})
			}

			// Emit
			await this.emitOnChannel("updateUserRole", channelId, userTargetId, newRole)

			console.log(`User ${userTargetId} is now ${newRole} on channel ${channelId}`)
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

	// Mute un user du channel
	async updateUserMute(channelId: number, userTargetId: number, userAuthId: number) {
		try {
			// Verifie si le channel existe
			const channelExist = !!await this.prisma.channel.findUnique({
				where: {
					id: channelId
				}
			})
			if (!channelExist)
				throw new NotFoundException("Channel not found")

			// Verifie si le user existe
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

			// Verifie si le user target est dans le channel et recupere son role
			const userTargetRole = await this.prisma.usersOnChannels.findUnique({
				where: {
					userId_channelId: {
						userId: userTargetId,
						channelId: channelId
					}
				},
				select: {
					role: true
				}
			})
			if (!userTargetRole)
				throw new NotFoundException("User not found")

			// Recupere le role du user authentifie
			const userAuthRole = await this.prisma.usersOnChannels.findUnique({
				where: {
					userId_channelId: {
						userId: userAuthId,
						channelId: channelId
					}
				},
				select: {
					role: true
				}
			})

			// Vérifie si le user authentifie a les permissions necessaires
			if (userTargetId !== userAuthId &&
				(userTargetRole.role === Role.OWNER ||
					(userAuthRole.role !== Role.OWNER
					&& userAuthRole.role !== Role.ADMIN)))
				throw new ForbiddenException("You dont have permissions for this action")

			// Mute le user
			const muteDuration = await this.prisma.usersOnChannels.update({
				where: {
					userId_channelId: {
						userId: userTargetId,
						channelId: channelId
					}
				},
				data: {
					mute: new Date(new Date().getTime() + 5 * 60000)
				},
				select: {
					mute: true
				}
			})

			// Emit
			const userTargetSocket: Socket = AppService.connectedUsers.get(userTargetId.toString())
			userTargetSocket.emit("updateUserMute", channelId, muteDuration.mute.toISOString())
		}
		catch (error) {
			if (error instanceof ForbiddenException || error instanceof NotFoundException)
				throw error
			else if (error instanceof Prisma.PrismaClientKnownRequestError)
				throw new ForbiddenException("The provided user data is not allowed")
			else
				throw new BadRequestException()
		}
	}

	// check si user.status =  status : userStatus
	// renvoie true si user.status !=  status false sinon

	async  checkStatus(userId: number, status: UserStatus): Promise<boolean> {
		try {
			// Recherche de l'utilisateur avec l'ID donné
			const user = await this.prisma.user.findUnique({
				where: {
					id: userId,
				},
			});
	
			if (!user)
				throw new NotFoundException("user not exist");
			const userstatus : UserStatus = user.status;
			return userstatus !== status
		} catch (error) {
			if (error instanceof NotFoundException)
				throw error
			else if (error instanceof Prisma.PrismaClientKnownRequestError)
				throw new ForbiddenException("The provided user data is not allowed")
			else
				throw new BadRequestException()
		}
	}

	async getAllSocketsChannelExceptUsers(channelId: number, userId: number[]) {
		try {
			const usersOnChannels = await this.prisma.usersOnChannels.findMany({
				where: {
					channelId: channelId,
					NOT: {
						userId: {
							in: userId
						}
					}
				},
				select: {
					userId: true,
				},
			});
			const userIds = usersOnChannels.map((userOnChannel) => userOnChannel.userId);
			return(userIds)
		} catch (error) {
			console.error('Une erreur s\'est produite lors de la récupération des sockets des utilisateurs du canal, sauf ceux des utilisateurs spécifiés :', error);
			throw error;
		}
	}


	async emitOnChannelExceptUsers(route: string, userTargetId: number[], ...args: any[]) {
		try {
			const channelId = args[0];
			const emitsId = await this.getAllSocketsChannelExceptUsers(channelId, userTargetId);

			emitsId.forEach((emitId) => {
				const socket = AppService.connectedUsers.get(emitId.toString())
				socket.emit(route, ...args);
			})
		} catch (error) {
			console.error('Une erreur s\'est produite lors de l\'émission des données sur le canal, à l\'exception des utilisateurs spécifiés :', error);
			throw error;
		}
	}

	// Change le statut d'une invitation
	async updateMessageStatus(channelId: number, messageId: number, userAuthId: number, newStatus: challengeStatus) { 
		try {
			// Verifie si le channel existe
			const channelExist = !!await this.prisma.channel.findUnique({
				where: {
					id: channelId
				}
			})
			if (!channelExist)
				throw new NotFoundException("Channel not found")

			// Verifie si le message existe et recupere ses donnees
			const messageDatas = await this.prisma.message.findUnique({
				where: {
					id: messageId
				},
				select: {
					authorId: true,
					targetId: true,
					isInvit: true,
					status: true
				}
			})
			if (!messageDatas)
				throw new NotFoundException("Message not found")

			// Verifie si le message est bien une invitation
			else if (!messageDatas.isInvit)
				throw new ForbiddenException("Message is not an invitation")

			// Verifie si l'invitation est destinee au user auth ou si il en est l'auteur
			else if (messageDatas.targetId !== userAuthId &&
				messageDatas.authorId !== userAuthId)
				throw new ForbiddenException("You dont have permissions for this action")

			// Verifie si le nouveau statut est accepte ou refuse
			else if (newStatus !== challengeStatus.IN_PROGRESS &&
				newStatus !== challengeStatus.CANCELLED)
				throw new ForbiddenException("You dont have permissions for this action")

			// Update l'invitation
			
			await this.prisma.message.update({
				where: {
					id: messageId
				},
				data: {
					status: newStatus
				}
			})
			// Emit
			//sofiane
			await this.emitOnChannel("updateChallenge", channelId, messageId, newStatus)

			if (newStatus === challengeStatus.IN_PROGRESS)
			{
				 if ( !(await this.checkIfUserExist(messageDatas.targetId)) || !(await this.checkIfUserExist(messageDatas.authorId)))
				 	throw new NotFoundException("user not exist");
				 if ((await this.checkStatus(messageDatas.targetId, UserStatus.ONLINE)))
				 	throw new ConflictException("There is not ONLINE");
				 if ((await this.checkStatus(messageDatas.authorId, UserStatus.ONLINE)))
				 	throw new ConflictException("There is not ONLINE");
				this.pongGateway.launchGame(messageDatas.targetId, messageDatas.authorId, messageId);
				if ( !(await this.checkIfUserExist(messageDatas.targetId)) || !(await this.checkIfUserExist(messageDatas.authorId)))
					throw new NotFoundException("user not exist");
				if ((await this.checkStatus(messageDatas.targetId, UserStatus.ONLINE)))
					throw new ConflictException("There is not ONLINE");
				if ((await this.checkStatus(messageDatas.authorId, UserStatus.ONLINE)))
					throw new ConflictException("There is not ONLINE");
				this.pongGateway.launchGame(messageDatas.targetId, 2, messageDatas.authorId);
			}
		}
		catch (error) {
			if (error instanceof ForbiddenException || error instanceof NotFoundException|| error instanceof ConflictException)
				throw error
			else if (error instanceof Prisma.PrismaClientKnownRequestError)
				throw new ForbiddenException("The provided user data is not allowed")
			else
				throw new BadRequestException()
		}
	}

	// Supprime un channel
	async remove(channelId: number) {
		try {
			// Verifie si le channel existe
			const channelExist = !!await this.prisma.channel.findUnique({
				where: {
					id: channelId
				}
			})
			if (!channelExist)
				throw new NotFoundException("Channel not found")

			// Emit
			await this.emitOnChannel("deleteChannel", channelId)

			// Supprime les relations user - channel
			await this.prisma.usersOnChannels.deleteMany({
				where: {
					channelId: channelId
				}
			})

			// Supprime les relations message - channel
			await this.prisma.message.deleteMany({
				where: {
					channelId: channelId
				}
			})

			// Supprime le channel
			await this.prisma.channel.delete({
				where: {
					id: channelId
				}
			})

			console.log(`Channel ${channelId} has been deleted`)
		}
		catch (error) {
			if (error instanceof NotFoundException)
				throw error
			else if (error instanceof Prisma.PrismaClientKnownRequestError)
				throw new ForbiddenException("The provided user data is not allowed")
			else
				throw new BadRequestException()
		}
	}

	// Retire un user d'un channel
	// Si le user etait owner, set un nouvel owner
	// Si le user etait le dernier, supprime le channel
	async leaveChannel(channelId: number, userAuthId: number, userTargetId: number): Promise<{ userId: number }> | undefined {
		try {
			// Verifie si le channel existe
			const channelExist = !!await this.prisma.channel.findUnique({
				where: {
					id: channelId
				}
			})
			if (!channelExist)
				throw new NotFoundException("Channel not found")

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

			// Verifie si le user target est dans le channel et recupere son role
			const userTargetRole = await this.prisma.usersOnChannels.findUnique({
				where: {
					userId_channelId: {
						userId: userTargetId,
						channelId: channelId
					}
				},
				select: {
					role: true
				}
			})
			if (!userTargetRole)
				throw new NotFoundException("User not found")

			// Recupere le role du user authentifie
			const userAuthRole = await this.prisma.usersOnChannels.findUnique({
				where: {
					userId_channelId: {
						userId: userAuthId,
						channelId: channelId
					}
				},
				select: {
					role: true
				}
			})

			// Pour les kicks uniquement, vérifie si le user authentifie a les permissions necessaires
			if (userTargetId !== userAuthId &&
				(userTargetRole.role === Role.OWNER ||
					(userAuthRole.role !== Role.OWNER
					&& userAuthRole.role !== Role.ADMIN)))
				throw new ForbiddenException("You dont have permissions for this action")

			// Emit
			await this.emitOnChannel("leaveChannel", channelId, userTargetId)

			// Supprime le user target du channel
			await this.prisma.usersOnChannels.delete({
				where: {
					userId_channelId: {
						userId: userTargetId,
						channelId: channelId
					}
				}
			})

			console.log(`User ${userTargetId} left channel ${channelId}`)

			// Compte le nombre de users restant non bannis dans le channel
			const countMembers: number = await this.prisma.usersOnChannels.count({
				where: {
					channelId: channelId,
					role: {
						notIn: [Role.BANNED, Role.UNBANNED]
					}
				}
			})

			// Supprime le channel si le dernier membre est parti
			if (countMembers === 0)
				await this.remove(channelId)

			// Set un nouvel owner si l'owner est parti
			else if (userTargetRole.role === "OWNER")
				return await this.setNewOwner(channelId)

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

/* =============================== UTILS ==================================== */

  // Retourne les sockets (string) des users du channel
  async getAllSocketsChannel(id: number)
  {
    const usersOnChannels = await this.prisma.usersOnChannels.findMany({
      where: {
        channelId: id,
      },
      select: {
        userId: true,

      },
    });

    const sockets = usersOnChannels.map((userOnChannel) => {
      const socket = AppService.connectedUsers.get(userOnChannel.userId?.toString())
      if (socket)
        return socket.id
      else
        return undefined
    })

	// console.log("usersOnChannels", usersOnChannels)
	// console.log("sockets", sockets)

    return sockets;
  }  

  // Retourne les sockets (string) des users du channel sauf celui du user
  async getAllSocketsChannelExceptUser(channelId: number, userId: number)
  {
    const usersOnChannels = await this.prisma.usersOnChannels.findMany({
      where: {
        channelId: channelId,
		NOT: {
			userId: userId
		}
      },
      select: {
        userId: true,
      },
    });

    const sockets = usersOnChannels.map((userOnChannel) => {
      const socket = AppService.connectedUsers.get(userOnChannel.userId?.toString())
      if (socket)
        return socket.id
      else
        return undefined
    })

	// console.log("usersOnChannels", usersOnChannels)
	// console.log("sockets", sockets)

    return sockets;
  }

    // Emit a tout les users d'un channel
    async emitOnChannel(route: string, ...args: any[]) {
      const channelId = args[0]
      const sockets = await this.getAllSocketsChannel(channelId)
      AppService.connectedUsers.forEach((socket) => {
        const socketToEmit = sockets.includes(socket.id)

        if (socketToEmit)
          socket.emit(route, ...args);
      })
    }

    // Emit a tout les users d'un channel sauf le user target
    async emitOnChannelExceptUser(route: string, userTargetId: number, ...args: any[]) {
		const channelId = args[0]
		const sockets = await this.getAllSocketsChannelExceptUser(channelId, userTargetId)
		AppService.connectedUsers.forEach((socket) => {
		  const socketToEmit = sockets.includes(socket.id)
  
		  if (socketToEmit)
			socket.emit(route, ...args);
		})
	  }
  
  

    // cherche un channel de type MP qui contient les 2 users
    async findChannelMP(recipientId: number, creatorId: number) {

    const channel = await this.prisma.channel.findFirst({
      where: {
        type: ChannelStatus.MP,
        users: {
          every: {
            OR: [
              {
                user: {
                  id: recipientId
                }
              },
              {
                user: {
                  id: creatorId
                }
              }
            ]
          }
        }
      }
    })
    return channel;
  }
  
   /*
       Renvoie le channel si il existe 
   */
	   async checkIfChannelExist(chanId : number)
	   {
		 const channel = await this.prisma.channel.findUnique({
		   where: { id: chanId },
		 });
		 return (channel)
	   }
	 
	   /*
			Renvoie le user si il existe dans le serveur
		*/
	 
	   async checkIfUserExist(chanId : number)
	   {
		 const user = await this.prisma.user.findUnique({
		   where: { id: chanId},
		 });
		 return (user)
	   }

  async isInChannel(userId: number, chanId: number) {
    
    const inChannel = await this.prisma.usersOnChannels.findUnique({
      where: {
       userId_channelId: {
        userId: userId,
        channelId: chanId
      }
    }});

  return inChannel;
}

async countMembersInChannel(chanId: number): Promise<number> {

  const result = (await this.prisma.channel.findUnique({
    where: {
      id: chanId
    },
    include: {
      users: true
    }
  })).users.length

  return (result)
}

	// Set un nouvel owner
	// Choisit le premier admin trouvé (par ordre d'ancienneté (à vérifier))
	// Si pas d'admins, choisit le premier membre trouvé (par ordre d'ancienneté (à vérifier))
	async setNewOwner(channelId: number): Promise<{ userId: number }> {
		try {
			// Vérifie si le channel existe
			const channelExist = !!await this.prisma.channel.findUnique({
				where: {
					id: channelId
				}
			})
			if (!channelExist)
				throw new NotFoundException("Channel not found")

			// Compte le nombre de users non bannis dans le channel
			const countMembers: number = await this.prisma.usersOnChannels.count({
				where: {
					channelId: channelId,
					role: {
						notIn: [Role.BANNED, Role.UNBANNED]
					}
				}
			})
			if (countMembers === 0)
				throw new NotFoundException("User not found")

			// Vérifie qu'il n'y ait pas déjà d'owner dans le channel
			const ownerFound = !!await this.prisma.usersOnChannels.findFirst({
				where: {
					channelId: channelId,
					role: Role.OWNER
				}
			})
			if (ownerFound)
				throw new ConflictException("There is already an owner in the channel")

			// Cherche un admin dans le channel
			const administratorFound = await this.prisma.usersOnChannels.findFirst({
				where: {
					channelId: channelId,
					role: Role.ADMIN
				},
				select: {
					userId: true
				}
			})

			// Cherche un membre dans le channel
			const memberFound = await this.prisma.usersOnChannels.findFirst({
				where: {
					channelId: channelId,
					role: Role.MEMBER
				},
				select: {
					userId: true
				}
			})

			// S'assure qu'un admin ou un membre ait bien été trouvé
			const newOwner = administratorFound ?? memberFound ?? null
			if (!newOwner)
				throw new NotFoundException("User not found")

			// Set le nouvel owner
			await this.prisma.usersOnChannels.update({
				where: {
					userId_channelId: {
						userId: newOwner.userId,
						channelId: channelId
					}
				},
				data: {
					role: Role.OWNER
				}
			})

			// Emit
			await this.emitOnChannel("setNewOwner", channelId, newOwner.userId)

			console.log(`User ${newOwner.userId} is the new owner of channel ${channelId}`)
			return (newOwner)
		}
		catch (error) {
			if (error instanceof NotFoundException || error instanceof ConflictException)
				throw error
			else if (error instanceof Prisma.PrismaClientKnownRequestError)
				throw new ForbiddenException("The provided user data is not allowed")
			else
				throw new BadRequestException()
		}
	}
}

/* =========================== PAS UTILISEES ================================ */

//   // Retourne tout les channels
//   async findAllChannels() {
//     const channels = await this.prisma.channel.findMany()

//     // console.log("Channels :", channels)
//     return channels;
//   }

//   // Retourne un channel
//   async findChannel(chanId: number, userId: number) {
//     const channel = await this.prisma.channel.findUnique({where: { id: chanId }},)
//     if (!channel)
//       throw new NotFoundException(`Channel id ${chanId} not found`);

//     if (channel.type === ChannelStatus.MP)
//     {
//       const recipientId = await this.prisma.usersOnChannels.findUnique({
//         where: {
//           userId_channelId: {
//             userId: userId,
//             channelId: chanId
//           }
//         },
//         select: {
//           userId: true
//         }
//       })

//       const recipient = await this.prisma.user.findUnique({
//         where: {
//           id: recipientId.userId
//         },
//         select: {
//           username: true,
//           avatar: true
//         }
//       })

//       const channelMP = {
//         ...channel,
//         name: recipient.username,
//         avatar: recipient.avatar
//       }

//       return channelMP
//     }
//     else
//       return channel;
//   }

//   async getAllMessage(id: number) {
// 	try {
// 	  const channel = await this.prisma.channel.findUnique({
// 		where: { id: id },
// 		include: { content: true },
// 	  });
  
// 	  if (!channel) {
// 		console.error("Le canal n'existe pas.");
// 		return null; // Retournez une valeur ou utilisez une exception appropriée
// 	  }
	  
// 	  const messages = channel.content;
  
// 	  if (!messages) { 
// 		console.error("Aucun message trouvé dans le canal.");
// 		return null; // Retournez une valeur ou utilisez une exception appropriée
// 	  }
  
// 	  //console.log(messages);
  
// 	  return messages;
// 	} catch (error) {
// 	  console.error("Une erreur s'est produite lors de la récupération des messages.", error);
// 	  return null; // Retournez une valeur ou utilisez une exception appropriée
// 	}
//   }

// async addUserInChannel(friendId: number, member: User, chanId: number) {
//   if (friendId === member.id)
//     return { error: 'Cannot add your self in channel'}

//   try {
//     this.findChannel(chanId, member.id);
    
//     if (await this.isInChannel(friendId, chanId))
//       throw new NotFoundException(`User ${friendId} is already in channel ${chanId}`);

//     const userInchannel = await this.isInChannel(member.id, chanId);
//     if (!userInchannel)
//       throw new NotFoundException(`User id ${member.id} is not in channel id ${chanId}`);
    
//       if (userInchannel.role ===  Role.MEMBER || !userInchannel.role)
//         throw new ForbiddenException(`User ${member.id} has not required role for this action`);
    
//       const addInChannel = await this.prisma.channel.update({ where: { id: chanId}, 
//       data: {
//         users: {
//           connect: [{ userId_channelId: { userId: friendId, channelId: chanId }}],
//           create: [{ userId: friendId, role: Role.MEMBER }]
//         }
//       }})
//       return addInChannel;
//   } catch (error) { 
//     if (error instanceof Prisma.PrismaClientKnownRequestError)
//       return { error: 'An error occurred while addind other user in channel' };
//     throw error;
//   }   
// }

  /****************************** CRUD USER ON CHANNEL ***********************/



  // ROLE USER : BLOCK, INVITE_PONG, GET_PROFILE, LEAVE, SEND_MESSAGE

  // ROLE ADMIN : BLOCK, LEAVE, KICK, BAN, MUTE /!\ if target is not owner

  // ROLE OWNER : SET_PASSWORD, SET_ADMINS
