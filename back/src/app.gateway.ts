import { OnModuleInit } from "@nestjs/common";
import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { AppService } from "./app.service";
import { UserStatus } from "@prisma/client";
import { PrismaService } from "./prisma/prisma.service";

@WebSocketGateway()
export class AppGateway implements OnModuleInit {

	constructor(private prisma: PrismaService) {}

	@WebSocketServer() public server: Server;

	onModuleInit() {
		this.server.on('connection', async (socket: Socket) => {

			const userid = socket.handshake.query.id;
	
		  // Vérifier le type de userid
		//   if (typeof userid === 'string') {
			// Emit
			await this.prisma.user.update({
				where: {
					id: parseInt(userid as string)
				},
				data: {
					status: UserStatus.ONLINE
				}
			})
			this.server.emit("updateUserStatus", parseInt(userid as string), UserStatus.ONLINE)
			AppService.connectedUsers.set(userid as string, socket);
			// Écouter le débranchement du socket
			socket.on('disconnect', async () => {
				// Emit
				await this.prisma.user.update({
					where: {
						id: parseInt(userid as string)
					},
					data: {
						status: UserStatus.OFFLINE
					}
				})
				this.server.emit("updateUserStatus", parseInt(userid as string), UserStatus.OFFLINE)
				AppService.connectedUsers.delete(userid as string);
			});


		//   } else {
		// 	console.log('Invalid userid type:', typeof userid);
		//   }
		});
	  } 
	getSocketByUserId(userid: string): Socket | undefined {
		return AppService.connectedUsers.get(userid);
	  }
}