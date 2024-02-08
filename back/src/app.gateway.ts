import { OnModuleInit } from "@nestjs/common";
import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { AppService } from "./app.service";
import { UserStatus } from "@prisma/client";

@WebSocketGateway()
export class AppGateway implements OnModuleInit {

	@WebSocketServer() public server: Server;

	onModuleInit() {
		this.server.on('connection', (socket: Socket) => {

			const userid = socket.handshake.query.id;
	
		  // Vérifier le type de userid
		  if (typeof userid === 'string') {
			// Emit
			this.server.emit("updateUserStatus", parseInt(userid), UserStatus.ONLINE)
			AppService.connectedUsers.set(userid, socket);
	
			// Écouter le débranchement du socket
			socket.on('disconnect', () => {
				// Emit
				this.server.emit("updateUserStatus", parseInt(userid), UserStatus.OFFLINE)
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