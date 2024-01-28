import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException, UseGuards } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChannelDto, UpdateChannelDto, AuthChannelDto, UpdateRoleDto } from './dto/';
import { Channel, User, ChannelStatus, Role, Prisma, messageStatus, challengeStatus  } from '@prisma/client';
import * as argon from 'argon2';
import { JwtGuard } from 'src/auth/guards/auth.guard';
import { Socket } from 'socket.io';
import { AppService } from 'src/app.service';

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
    //console.log(`Channel ${newChannel.id} was created`)
    return newChannel;
  }

	// Cree un channel MP et y ajoute un user
	async createChannelMP(userAuthId: number, userTargetId: number) {
		try {
			const channelMPAlreadyExist = await this.findChannelMP(userTargetId, userAuthId)
			if (channelMPAlreadyExist)
				throw new ConflictException("MP channel already exist")

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

			const channelMP = {
				...newChannelMP,
				...userTarget
			}

			await this.emitToChannel("createChannelMP", channelMP.id, userTargetId)

			console.log(`Channel MP ${channelMP.id} was created`)
			return channelMP
		}
		catch (error) {
			if (error instanceof ConflictException || error instanceof NotFoundException)
				throw error
			else if (error instanceof Prisma.PrismaClientKnownRequestError)
				throw new ForbiddenException("The provided user data is not allowed")
			else
				throw new BadRequestException()
		}
	}

  // Ajoute un user dans un channel
  async joinChannel(joinChannelDatas: AuthChannelDto, channelId: number, userId: number) {
    try {
      const channelToJoin = await this.findChannel(channelId, userId);
      
      const inChan = await this.isInChannel(userId, channelToJoin.id);

      if (inChan)
      {
        if (inChan.role === Role.BANNED)
          throw new ForbiddenException(`User ${userId} is banned from channel ${channelToJoin.id}'`);
        throw new BadRequestException(`User ${userId} is already in channel ${channelToJoin.id}`);
      }

      if (channelToJoin.password) {
        const pwdMatch = await argon.verify(channelToJoin.password, joinChannelDatas.password);
			if (!pwdMatch)
				throw new ForbiddenException('Incorrect password');
      }

      const joinChannel = await this.prisma.channel.update({ where: { id: channelToJoin.id}, 
        data: {
          users: { 
            create: [
              {
                role: 'MEMBER',
                user: {connect: { id: userId }}
              }
            ]  
          }
        }})

      await this.emitToChannel("joinChannel", channelId, userId)

      console.log(`User ${userId} joined channel ${channelId}`)

      return joinChannel;

    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError)
        return { error: 'An error occurred while addind other user in channel' };
      throw error;
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
  async updateUserRole(channelId: number, userTargetId: number, userAuthId: number, newRole: UpdateRoleDto) {
    try {
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

      let response: any

      if (newRole.role === Role.UNBANNED)
      {
        if (userAuthRole.role !== Role.ADMIN && userAuthRole.role !== Role.OWNER)
         throw new ForbiddenException(`User ${userAuthId} has not required role for this action`);
        const unbannedUser = await this.prisma.usersOnChannels.delete({
          where: {
            userId_channelId: {
              userId: userTargetId,
              channelId: channelId
            }
          }
        })

        response = unbannedUser
      }
      else
      {
        if (((newRole.role === Role.ADMIN || newRole.role === Role.MEMBER)
            && userAuthRole.role !== Role.OWNER)
            || newRole.role === Role.BANNED && userAuthRole.role !== Role.OWNER && userAuthRole.role !== Role.ADMIN)
          throw new ForbiddenException(`User ${userAuthId} has not required role for this action`);

        const updateRole = await this.prisma.usersOnChannels.update({
          where: {
            userId_channelId: {
              userId: userTargetId,
              channelId: channelId
            }
          },
          data: {
            role: newRole.role
          }
        })

        response = updateRole
      }

      await this.emitToChannel("updateUserRole", channelId, userTargetId, newRole.role)

      console.log(`User ${userTargetId} is now ${newRole.role} on channel ${channelId}`)
      return (response)

    } catch (error) { }    
  }

  // Supprime un channel
  async remove(channelId: number) {
  
    // Informe les autres users de la suppression du channel
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
		const deleteChannel = await this.prisma.channel.delete({
      where: {
        id: channelId
      }
    });


    console.log(`Channel ${channelId} has been deleted`)
		return deleteChannel;
	}

  // Retire un user d'un channel
  // Si le user etait owner, set un nouvel owner
  // Si le user etait le dernier, supprime le channel
  async leaveChannel(channelId: number, userTargetId: number, userAuthId: number) {

    if (userTargetId !== userAuthId)
    {
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

      if (userAuthRole.role !== Role.ADMIN && userAuthRole.role !== Role.OWNER)
       throw new ForbiddenException(`User ${userAuthId} has not required role for this action`);
    }

    await this.emitToChannel("leaveChannel", channelId, userTargetId)

    const userLeave = await this.prisma.usersOnChannels.delete({
      where: {
        userId_channelId: {
          userId: userTargetId,
          channelId: channelId
        }
      }
    })

    console.log(`User ${userTargetId} left channel ${channelId}`)

    const numberOfMembers: number = await this.countMembersInChannel(channelId)
  
    // Supprime le channel
    if (numberOfMembers === 0)
    {
      const removeChannel = await this.remove(channelId)
      return ([ userLeave, removeChannel ])
    }
    // Set un nouvel owner
    else if (userLeave.role === "OWNER")
    {
      const newOwner = await this.setNewOwner(channelId)
      return ([ userLeave, newOwner ])
    }

    return (userLeave)
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

async setNewOwner(channelId: number) {
  
  const administratorFound = await this.prisma.usersOnChannels.findFirst({
    where: {
      channelId: channelId,
      role: "ADMIN"
    },
    select: {
      userId: true,
      role: true
    }
  })
  const memberFound = await this.prisma.usersOnChannels.findFirst({
    where: {
      channelId: channelId,
      role: "MEMBER"
    },
    select: {
      userId: true,
      role: true
    }
  })

  const newOwner = administratorFound ? administratorFound : memberFound

  await this.prisma.usersOnChannels.update({
    where: {
      userId_channelId: {
        userId: newOwner.userId,
        channelId: channelId
      }
    },
    data: {
      role: "OWNER"
    },
    select: {
      userId: true,
      role: true
    }
  })

  console.log(`User ${newOwner.userId} is the new owner of channel ${channelId}`)
}

/* =========================== PAS UTILISEES ================================ */

async addUserInChannel(friendId: number, member: User, chanId: number) {
  if (friendId === member.id)
    return { error: 'Cannot add your self in channel'}

  try {
    this.findChannel(chanId, member.id);
    
    if (await this.isInChannel(friendId, chanId))
      throw new NotFoundException(`User ${friendId} is already in channel ${chanId}`);

    const userInchannel = await this.isInChannel(member.id, chanId);
    if (!userInchannel)
      throw new NotFoundException(`User id ${member.id} is not in channel id ${chanId}`);
    
      if (userInchannel.role ===  Role.MEMBER || !userInchannel.role)
        throw new ForbiddenException(`User ${member.id} has not required role for this action`);
    
      const addInChannel = await this.prisma.channel.update({ where: { id: chanId}, 
      data: {
        users: {
          connect: [{ userId_channelId: { userId: friendId, channelId: chanId }}],
          create: [{ userId: friendId, role: Role.MEMBER }]
        }
      }})
      return addInChannel;
  } catch (error) { 
    if (error instanceof Prisma.PrismaClientKnownRequestError)
      return { error: 'An error occurred while addind other user in channel' };
    throw error;
  }   
}




  /****************************** CRUD USER ON CHANNEL ***********************/



  // ROLE USER : BLOCK, INVITE_PONG, GET_PROFILE, LEAVE, SEND_MESSAGE

  // ROLE ADMIN : BLOCK, LEAVE, KICK, BAN, MUTE /!\ if target is not owner

  // ROLE OWNER : SET_PASSWORD, SET_ADMINS


}
