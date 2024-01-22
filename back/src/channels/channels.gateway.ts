import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { ChannelsService, connectedUsers } from './channels.service';
import { CreateChannelDto, UpdateChannelDto, MessageDto } from './dto';
import { OnModuleInit, Request } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { User, Channel } from "@prisma/client";

// create a channel
// CRUD channel 
// create
// read
// update
// delete

// send message to a channel
// send message to a user

// send request tu a user

@WebSocketGateway()
export class ChannelsGateway implements OnModuleInit {
  constructor(private readonly channelsService: ChannelsService) {}

  @WebSocketServer() server: Server;

  // Gestion de la map userConnected (ajoute/supprime des sockets)
  onModuleInit() { 
    this.server.on('connection', (socket: Socket) => {
      const userid = socket.handshake.query.id;
      //console.log("Connected id =", userid);

      // Vérifier le type de userid
      if (typeof userid === 'string') {
        connectedUsers.set(userid, socket);

        // Écouter le débranchement du socket
        socket.on('disconnect', () => {
          console.log("deleted user = ", userid);
          connectedUsers.delete(userid);
        });
      } else {
        console.log('Invalid userid type:', typeof userid);
      }
    });
  } 
    getSocketByUserId(userid: string): Socket | undefined {
    return connectedUsers.get(userid);
  }


   /*
    args[0] tableau de sockets des users channel
    args[1] id du user qui envoie (sender)
    args[2] channel id
    args[3] target id / message
   */

  @SubscribeMessage('sendDiscussion')
  async handleUpdateDiscussion(client: Socket, args: string[]) {
    for (const socket of args[0]) {
      this.server.to(socket).emit("updateDiscussion", args[1], args[2], args[3]);
    }
  }

  /*
    args[0] tableau de sockets des users channel
    args[1] id du channel MP cree
   */

    @SubscribeMessage('createChannelMP')
    async handleCreateChannelMP(client: Socket, args: any[]) {
      const argsToSend = args.slice(1)
      for (const socket of args[0]) {
        this.server.to(socket).emit("createChannelMP", ...argsToSend);
      }
    }  

  /*
    args[0] tableau de sockets des users channel
    args[1] id du channel rejoint
    args[2] user qui a join
   */

  @SubscribeMessage('joinChannel')
  async handleJoinChannel(client: Socket, args: any[]) {
    const argsToSend = args.slice(1)
    for (const socket of args[0]) {
      this.server.to(socket).emit("joinChannel", ...argsToSend);
    }
  }

  /*
    args[0] tableau de sockets des users channel
    args[1] id du channel
    args[2] nouvelles donnees du channel
   */

  @SubscribeMessage('updateChannel')
  async handleUpdateChannel(client: Socket, args: any[]) {
    const argsToSend = args.slice(1)
    for (const socket of args[0]) {
      this.server.to(socket).emit("updateChannel", ...argsToSend);
    }
  }

  /*
    args[0] tableau de sockets des users channel
    args[1] id du channel
    args[2] id du user modifie
    args[3] nouveau role du user modifie
   */

  @SubscribeMessage('updateUserRole')
  async handleUpdateUserRole(client: Socket, args: any[]) {
    const argsToSend = args.slice(1)
    for (const socket of args[0]) {
      this.server.to(socket).emit("updateUserRole", ...argsToSend);
    }
  }
  
  /*
    args[0] tableau de sockets des users channel
    args[1] id du channel
   */

  @SubscribeMessage('deleteChannel')
  async handleDeleteChannel(client: Socket, args: any[]) {
    const argsToSend = args.slice(1)
    for (const socket of args[0]) {
      this.server.to(socket).emit("deleteChannel", ...argsToSend);
    }
  }

  /*
    args[0] tableau de sockets des users channel
    args[1] id du channel quitte
    args[2] user qui a leave
   */

    @SubscribeMessage('leaveChannel')
    async handleLeaveChannel(client: Socket, args: any[]) {
      const argsToSend = args.slice(1)
      for (const socket of args[0]) {
        this.server.to(socket).emit("leaveChannel", ...argsToSend);
      }
    }
  
//   // afterInit(server: Server) {
//   //   console.log("server after init" );
//   // }

//   handleDisconnect(client: Socket) {
//     // console.log(`Disconnected: ${client.id}`);
//   }

//   @SubscribeMessage('newMessage')
//   createMessage(@MessageBody() Body: MessageDto) {
//     console.log(Body);
//     this.server.emit('onMessage', Body);
//   }

//   @SubscribeMessage('private message')
// handlePrivateMessage(client: any, data: any) {
//     client.to(data.to).emit('private message', {
//       from: client.id,
//       message: data.message,
//     });
// }

//   handleConnection(client: Socket, ...args: any[]) {
//     // console.log(`Connected ${client.id}`);
//   }

//   @SubscribeMessage('createChannel')
//   create(@MessageBody() createChannelDto: CreateChannelDto,  @Request() creator: User) {
//     return this.channelsService.createChannel(createChannelDto, creator);
//   }

//   @SubscribeMessage('findAllChannels')
//   findAll() {
//     return this.channelsService.findAllChannels();
//   }

//   @SubscribeMessage('findOneChannel')
//   findOne(@MessageBody() id: number, @Request() member: User) {
//     return this.channelsService.findOneChannel(id, member);
//   }

//   @SubscribeMessage('updateChannel')
//   update(@MessageBody() updateChannelDto: UpdateChannelDto, @Request() member: User) {
//     return this.channelsService.updateChannel(updateChannelDto, member);
//   }

//   @SubscribeMessage('removeChannel')
//   remove(@MessageBody() id: number) {
//     return this.channelsService.remove(id);
//   }

}
