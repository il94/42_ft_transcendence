import {WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway()
export class PongGateway {

	@WebSocketServer()
	server: Server;

	handleConnection(client: Socket){
	}

	handleDeconnection(client: Socket){
	}

	@SubscribeMessage("score")
	// handleScore(@MessageBody() data: string, @ConnectedSocket() client: Socket, args: any){
	handleScore(client: Socket, data: any){
		const clientID = client.id;

		console.log("emit back", data)
		this.server.emit('score', client.id, data) // broadcast to all connected //marche pas
	}


}

// reception de challenge

// envie de spectate


// receive de la direction de la ball ----> (voir gerer la pos du back ici meme)

// receive de la pos du paddle enemi ---> (voir gerer les moove des deux paddles)

// receive de score

// receive de la victoire ou defaite 

// 