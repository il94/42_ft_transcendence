import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { ChannelsService } from './channels.service';
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

  private connectedUsers: Map<string, Socket> = new Map();

  onModuleInit() {
    this.server.on('connection', (socket: Socket) => {
      const userid = socket.handshake.query.id;
      //console.log("Connected id =", userid);

      // Vérifier le type de userid
      if (typeof userid === 'string') {
        this.connectedUsers.set(userid, socket);

        // Écouter le débranchement du socket
        socket.on('disconnect', () => {
          this.connectedUsers.delete(userid);
        });
      } else {
        console.log('Invalid userid type:', typeof userid);
      }
    });
  } 
    getSocketByUserId(userid: string): Socket | undefined {
    return  this.connectedUsers.get(userid);
  }

  /* args[0] = message recu en string // args[1] = Channel en channel  */

  @SubscribeMessage('sendMessage')
  async handleSendMessage(client: Socket, args: string) {
    for (const userId of args[0]) {
      let socket = await this.getSocketByUserId(userId.toString());
      if (socket) 
        socket.emit("printMessage", args[1].toString(), args[2], args[3]);
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
