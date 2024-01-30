import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException, UseGuards } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChannelDto, UpdateChannelDto, AuthChannelDto, UpdateRoleDto } from './dto/';
import { Channel, User, ChannelStatus, Role, Prisma, messageStatus, challengeStatus  } from '@prisma/client';
import * as argon from 'argon2';
import { JwtGuard } from 'src/auth/guards/auth.guard';
import { Socket } from 'socket.io';
import { AppService } from 'src/app.service';

type ChannelMP = {
	id: number,
    createdAt: Date,
    name: string,
    avatar: string,
    type: ChannelStatus,
    password: string
}

@UseGuards(JwtGuard)
@Injectable()
export class ChannelsService {
  constructor(private prisma: PrismaService) {}

  // Cree un channel
  async createChannel(createChannelDto: CreateChannelDto, creatorId: number) {
    const newChannel = await this.prisma.channel.create({
      data: {
        name: createChannelDto.name,
        avatar: createChannelDto.avatar,
        type: createChannelDto.type,
        users: { 
          create: [
            {
              role: 'OWNER',
              user: {connect: { id: creatorId }}
            }
          ]  
        },
      }
    })
    // setting password
    if (newChannel.type === ChannelStatus.PROTECTED)
    {
      await this.prisma.channel.update({ where: { id: newChannel.id },
        data: { password: await argon.hash(createChannelDto.password) } 
      })
    }
	
    console.log(`Channel ${newChannel.id} was created`, newChannel)
    return newChannel;
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

			// Verifie si le user target existe et retourne son username et son avatar
			const userTarget = await this.prisma.user.findUnique({
				where: {
					id: userTargetId
				},
				select: {
					username: true,
					avatar: true
				}
			})
			if (!userTarget)
				throw new NotFoundException("User not found")

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
				name: userTarget.username,
				avatar: userTarget.avatar,
				...newChannelMP
			}

			// Emit
			await this.emitToChannel("createChannelMP", channelMP.id, userTargetId)

			console.log(`Channel MP ${channelMP.id} was created`)
			return channelMP
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

	// Ajoute un user dans un channel
	async joinChannel(channelId: number, userId: number, password?: string, inviterId?: number) {
		try {
			// Verifie si le channel existe et le retourne
			const channelToJoin = await this.prisma.channel.findUnique({
				where: {
					id: channelId
				}
			})
			if (!channelToJoin)
				throw new NotFoundException("Channel not found")

			// Verifie si le user qui aurait lancé l'invitation est dans le channel
			if (inviterId)
			{
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

			// Verifie si le user existe et récupère son username
			const user = await this.prisma.user.findUnique({
				where: {
					id: userId
				},
				select: {
					username: true
				}
			})
			if (!user)
				throw new NotFoundException("User not found")

			// Verifie si le user n'est pas déjà dans le channel 
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
			if (channelToJoin.password && !inviterId)
			{
				const pwdMatch = await argon.verify(channelToJoin.password, password);
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

				// Emit
				await this.emitToChannel("joinChannel", channelId, userId)
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

  // Retourne tout les channels
  async findAllChannels() {
    const channels = await this.prisma.channel.findMany()

    // console.log("Channels :", channels)
    return channels;
  }

  // Retourne tout les channels PUBLIC et PROTECTED
  async findAllChannelsAccessibles() {
    const accessibleChannels = await this.prisma.channel.findMany({
      where: { type: {
        in: ['PUBLIC', 'PROTECTED']
      }
    },
    })

    // console.log("Accessibles channels :", accessibleChannels)
    return accessibleChannels;
  }

  // Retourne un channel
  async findChannel(chanId: number, userId: number) {
    const channel = await this.prisma.channel.findUnique({where: { id: chanId }},)
    if (!channel)
      throw new NotFoundException(`Channel id ${chanId} not found`);

    if (channel.type === ChannelStatus.MP)
    {
      const recipientId = await this.prisma.usersOnChannels.findUnique({
        where: {
          userId_channelId: {
            userId: userId,
            channelId: chanId
          }
        },
        select: {
          userId: true
        }
      })

      const recipient = await this.prisma.user.findUnique({
        where: {
          id: recipientId.userId
        },
        select: {
          username: true,
          avatar: true
        }
      })

      const channelMP = {
        ...channel,
        name: recipient.username,
        avatar: recipient.avatar
      }

      return channelMP
    }
    else
      return channel;
  }

  // Retourne un channel avec ses relations
  async findChannelWithRelations(chanId: number, userId: number) {
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
            role: true
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
      throw new NotFoundException(`Channel ${chanId} not found`);
    const { users, content, ...rest } = channelDatas
    const cleanedMessages = await Promise.all(content.map(async (message) => {
      if (message.type === "TEXT") {
        const { status, author, ...rest } = message;
        console.log("TEXT = ", message);
        return {
          ...rest,
          sender: author
        };
      }

      else {
        const { author, targetId, ...rest } = message;
        console.log("INVITATION = ", message);
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

    console.log("RESULT", cleanedMessages)

    function getMPData() {
      return {
        name: channelDatas.users.find((user) => user.user.id !== userId).user.username,
        avatar: channelDatas.users.find((user) => user.user.id !== userId).user.avatar,
      }
    }

    const channelWithRelations = {
      ...rest,
      name: rest.type === ChannelStatus.MP ? getMPData().name : rest.name,
      avatar: rest.type === ChannelStatus.MP ? getMPData().avatar : rest.avatar,
      messages: cleanedMessages,
      members: channelDatas.users.map((user) => {
        if (user.role === Role.MEMBER)
          return (user.user)
      }).filter(Boolean),
      administrators: channelDatas.users.map((user) => {
        if (user.role === Role.ADMIN)
          return (user.user)
      }).filter(Boolean),
      owner: channelDatas.users.find((user) => user.role === Role.OWNER)?.user,
      mutedUsers: [], // en attendant de pouvoir recup les users mutes
      banneds: channelDatas.users.map((user) => {
        if (user.role === Role.BANNED)
          return (user.user)
      }).filter(Boolean)
    }

    // console.log(`Channel ${chanId} with relations :`, channelWithRelations)
    return channelWithRelations;
  }

  // Retourne les sockets (string) des users
  async getAllSockets(id: number)
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

	console.log("usersOnChannels", usersOnChannels)
	console.log("sockets", sockets)

    return sockets;
  }

  // Modifie un channel
  async updateChannel(channelId: number, newChannelDatas: UpdateChannelDto, userId: number) {
    try {
      const channelToUpdate = await this.findChannel(channelId, userId);
      const inChan = await this.isInChannel(userId, channelToUpdate.id)
      if (!inChan)
        throw new NotFoundException(`User ${userId} is not in channel ${channelToUpdate.id}`);
      if (channelToUpdate.password) {
        const pwdMatch = await argon.verify(channelToUpdate.password, newChannelDatas.password);
			if (!pwdMatch)
				throw new ForbiddenException('Incorrect password');
      }
      if (inChan.role !== Role.OWNER || !inChan.role)
        throw new ForbiddenException(`User ${userId} has not required role for this action`);
      
      await this.emitToChannel("updateChannel", channelId, newChannelDatas)

      const updateChannel = await this.prisma.channel.update({ where: { id: channelToUpdate.id}, 
        data: {
          name: newChannelDatas.name,
          type: newChannelDatas.type,
          password:	newChannelDatas.password,
          avatar: newChannelDatas.avatar
        }
      })
      
      console.log(`Channel ${channelId} has been updated`)
      return updateChannel;

    } catch (error) { }    
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
			await this.emitToChannel("updateUserRole", channelId, userTargetId, newRole)

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
			await this.emitToChannel("deleteChannel", channelId)

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
				userTargetRole.role === Role.OWNER ||
					(userAuthRole.role !== Role.OWNER &&
					userAuthRole.role !== Role.ADMIN))
				throw new ForbiddenException("You dont have permissions for this action")

			// Emit
			await this.emitToChannel("leaveChannel", channelId, userTargetId)

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

    /****************************** gestion message ***********************/

    /* 
    
    model Message {
      id        Int  @id @default(autoincrement()) 
      author    User @relation(fields: [authorId], references: [id])
      authorId  Int
      channel   Channel @relation(fields: [channelId], references: [id])
      channelId Int
      //targetId  Int? // add
      content   String? 
      type      messageStatus // add
      status    challengeStatus? // add
      isInvit   Boolean @default(false)
}
    
    */

    async addContent(chanId: number, msg:string, userId :number, msgStatus : messageStatus) {
  
        const newMessage = await this.prisma.message.create({
          data: {
            author: { connect: { id: userId} },  // Connectez le message à l'utilisateur existant
            channel: { connect: { id: chanId } }, 
            content: msg,
            isInvit: true,
            type: msgStatus,
          },
        });
        return newMessage.id;
      }
  
    async addContentInvitation(id: number, userId : number, targetId : number, msgStatus : messageStatus) {
      const newMessage = await this.prisma.message.create({
        data: {
          author: { connect: { id: userId } },  // Connectez le message à l'utilisateur existant
          channel: { connect: { id: id } },
          isInvit: true,
          targetId: targetId,
          status:  challengeStatus.PENDING,
          type: msgStatus,
        },
      });
      return newMessage.id;
    }

    async getAllMessage(id: number) {
      try {
        const channel = await this.prisma.channel.findUnique({
          where: { id: id },
          include: { content: true },
        });
    
        if (!channel) {
          console.error("Le canal n'existe pas.");
          return null; // Retournez une valeur ou utilisez une exception appropriée
        }
        
        const messages = channel.content;
    
        if (!messages) { 
          console.error("Aucun message trouvé dans le canal.");
          return null; // Retournez une valeur ou utilisez une exception appropriée
        }
    
        //console.log(messages);
    
        return messages;
      } catch (error) {
        console.error("Une erreur s'est produite lors de la récupération des messages.", error);
        return null; // Retournez une valeur ou utilisez une exception appropriée
      }
    }


    async updateMessageStatus(idMsg: number, newStatus: challengeStatus)
    { 
      try {
        const updatedMessage = await this.prisma.message.update({
          where: { id: idMsg },
          data: { status: newStatus },
        });
        return updatedMessage;
      } catch (error) { 
        throw error;
    }
  }

/* =============================== UTILS ==================================== */

    // Emit a tout les users d'un channel
    async emitToChannel(route: string, ...args: any[]) {
      const channelId = args[0]
      const sockets = await this.getAllSockets(channelId)
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
			await this.emitToChannel("setNewOwner", channelId, newOwner.userId)

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

/* =========================== PAS UTILISEES ================================ */

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


}
