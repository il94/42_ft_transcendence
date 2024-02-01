import { ConflictException, Search } from "@nestjs/common";
import {WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway()
export class PongGateway {

	private searchingUsers: Map<string, Socket> = new Map();

	@WebSocketServer()
	server: Server;

	handleConnection(client: Socket){
	}

	handleDeconnection(client: Socket){
	}

	/*
		data[0] = id user
	*/

	@SubscribeMessage('searchGame')
	addSearchingPlayer(client: Socket, data: any) {
		try {
			if (this.searchingUsers.get(data[0]))
				throw new ConflictException('User already in game')
			this.searchingUsers[data[0]] = client;
			let keysIterator  = this.searchingUsers.keys()
			let keysArray = Array.from(keysIterator);
			let firstkeys = keysArray[0]
			let secondkeys = keysArray[1]
			if (this.searchingUsers.size >= 2)
			{
				
				this.searchingUsers[this.searchingUsers.get[keysArray[0]]].emit("launchGame", keysArray[1])
				this.searchingUsers[this.searchingUsers.get[keysArray[1]]].emit("launchGame", keysArray[0])
			}
			console.log('data[0]', this.searchingUsers[0]);
			console.log('sockets: ', )
		} catch (error) {
			throw error
		}
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