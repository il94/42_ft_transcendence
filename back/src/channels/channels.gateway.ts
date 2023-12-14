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

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log(socket.id);
      console.log('Connected');
    })
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(client: Socket, payload: Channel) {
    //await this.channelsService.createMessage(payload);
    this.server.emit('recMessage', payload);
  }

  afterInit(server: Server) {
    console.log(server);
  }

  handleDisconnect(client: Socket) {
    console.log(`Disconnected: ${client.id}`);
  }

  @SubscribeMessage('newMessage')
  createMessage(@MessageBody() Body: MessageDto) {
    console.log(Body);
    this.server.emit('onMessage', Body);
  }

  @SubscribeMessage('private message')
handlePrivateMessage(client: any, data: any) {
    client.to(data.to).emit('private message', {
      from: client.id,
      message: data.message,
    });
}

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Connected ${client.id}`);
  }

  @SubscribeMessage('createChannel')
  create(@MessageBody() createChannelDto: CreateChannelDto,  @Request() creator: User) {
    return this.channelsService.createChannel(createChannelDto, creator);
  }

  @SubscribeMessage('findAllChannels')
  findAll() {
    return this.channelsService.findAllChannels();
  }

  @SubscribeMessage('findOneChannel')
  findOne(@MessageBody() id: number, @Request() member: User) {
    return this.channelsService.findOne(id, member);
  }

  @SubscribeMessage('updateChannel')
  update(@MessageBody() updateChannelDto: UpdateChannelDto) {
    return this.channelsService.update(updateChannelDto.id, updateChannelDto);
  }

  @SubscribeMessage('removeChannel')
  remove(@MessageBody() id: number) {
    return this.channelsService.remove(id);
  }

}
