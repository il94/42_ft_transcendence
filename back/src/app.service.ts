import { Injectable } from "@nestjs/common";
import { Socket } from "socket.io";
import { PrismaService } from "./prisma/prisma.service";
import { UserStatus, challengeStatus } from "@prisma/client";
import { AppGateway } from "./app.gateway";

@Injectable()
export class AppService {
	public static connectedUsers: Map<string, Socket> = new Map();
	constructor
	(
		private prisma: PrismaService,
    //private appGateway: AppGateway,
		) {}
	//public static searchingUsers: Map<string, Socket> = new Map();

	public async getAllSocketsChannel(id: number)
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

	  public async emitOnChannel(route: string, ...args: any[]) {
		const channelId = args[0]
		const sockets = await this.getAllSocketsChannel(channelId)
		AppService.connectedUsers.forEach((socket) => {
		  const socketToEmit = sockets.includes(socket.id)
  
		  if (socketToEmit)
			socket.emit(route, ...args);
		})
	  }
    async	cancelAllInvitation(userId : number)
	  {
      const messageAuthor = await this.prisma.message.findMany({
        where: {
          authorId: userId,
          isInvit: true,
          NOT: {
            status: challengeStatus.CANCELLED,
          },
        },
      });
   }
  //   async updateStatusUser(idUser : number, newStatus: UserStatus)
  //   {
  //     await this.prisma.user.update({ where: { id: idUser},
  //       data: { status: newStatus }
  //      })
  //      if (newStatus !== UserStatus.ONLINE)
  //        await this.cancelAllInvitation(idUser)
  //       this.appGateway.server.emit("updateUserStatus", idUser, newStatus);
        
    }
