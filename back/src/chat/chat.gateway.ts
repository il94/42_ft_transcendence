import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';


@WebSocketGateway({
    cors: {
      origin: '*',
    },
  }) 
  export class ChannelsGateway {
    @WebSocketServer() server: Server;
  
   
    @SubscribeMessage('sendMsg')
    handleNewMessage(client: Socket, message: string): void{
        console.log(message);
    }

  }