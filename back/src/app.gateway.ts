import { OnModuleInit } from "@nestjs/common";
import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { AppService } from "./app.service";

@WebSocketGateway()
export class AppGateway implements OnModuleInit {

	@WebSocketServer() server: Server;

	onModuleInit() {
		this.server.on('connection', (socket: Socket) => {
		  const userid = socket.handshake.query.id;
		//   console.log("Connected id =", userid);
	
		  // Vérifier le type de userid
		  if (typeof userid === 'string') {
			AppService.connectedUsers.set(userid, socket);
	
			// Écouter le débranchement du socket
			socket.on('disconnect', () => {
				AppService.connectedUsers.delete(userid);
			});


		  } else {
			console.log('Invalid userid type:', typeof userid);
		  }
		});
	  } 
	getSocketByUserId(userid: string): Socket | undefined {
		return AppService.connectedUsers.get(userid);
	  }
}