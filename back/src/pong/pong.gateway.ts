import {WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket} from "@nestjs/websockets";
import { ConflictException, Search } from "@nestjs/common";

import { Server, Socket } from "socket.io";

import { AppService } from 'src/app.service';
import { PongService } from "./pong.service";
import { lstat } from "fs";
import { PongGame, Player, Ball } from "./game";

@WebSocketGateway()
export class PongGateway {
	
	@WebSocketServer()
	server: Server;
	
	private searchingUsers: Map<number, Socket> = new Map();

	constructor(private  PongService: PongService) {}

	handleConnection(client: Socket){
	}
	
	handleDeconnection(client: Socket){
	}
	
	@SubscribeMessage('searchGame')
	addSearchingPlayer(client: Socket, data: any) {
		try {			
			if (this.searchingUsers.get(data)){
				this.searchingUsers.delete(data)
				console.log("is now out of search")
				return
				// throw new ConflictException('User already in game')
			}

			this.searchingUsers.set(data, client)
			console.log("is now in search")

			let keysIterator  = this.searchingUsers.keys()
			let keysArray = Array.from(keysIterator);
			let firstkey = keysArray[0]

			if (this.searchingUsers.size >= 2)
			{		
				let secondkey = keysArray[1]

				let firstsocket = this.searchingUsers.get(firstkey)
				let secondsocket = this.searchingUsers.get(secondkey)

				// recup l'user authenticate de l'enemi pour l'envoyer au front ?

				this.server.to(firstsocket.id).emit("launchGame", secondkey)
				this.server.to(secondsocket.id).emit("launchGame", firstkey)
			
				this.PongService.activeGames.push(new PongGame(firstsocket, secondsocket))

				console.log("map size", this.searchingUsers.size)
				console.log("in back", secondkey)
				console.log("in back", firstkey)
				// this.searchingUsers.delete(firstkey)
				// this.searchingUsers.delete(secondkey)
			}
		} catch (error) {
			//throw error
		}
	}

	// @SubscribeMessage("PongBounds")
	// handlePongBounds(client: Socket, data: any){
	// 	console.log("PongBounds = ", data)
	// 	this.PongBounds = {
	// 		height: data.height,
	// 		width: data.width
	// 	}
	// 	this.PaddleX = (this.PongBounds.width * 2.5 / 100)

	// 		this.LeftPaddlePos = { top : 45 * (this.PongBounds.height/100) , bottom: 55 * (this.PongBounds.height/100)}
	// 		this.RightPaddlePos = { top : 45 * (this.PongBounds.height/100) , bottom: 55 * (this.PongBounds.height/100)}
	// 	}

	@SubscribeMessage("score")
	// handleScore(@MessageBody() data: string, @ConnectedSocket() client: Socket, args: any){
		handleScore(client: Socket, args: any){
			const clientID = client.id;
			
			console.log("Score : ", args)
			// if (parseInt(args[0]) >= 11 || parseInt(args[1]) >= 11) // check the score finish game
			this.server.to(client.id).emit('score', client.id, args)
			
		}
		
		
		// // private PaddleCollision(){
			// // 	if (this.BallPos.x + this.BallSize > this.PongBounds.width - this.PaddleX)
			// // 	{
				// // 		if ((this.BallPos.y + this.BallSize >= RightPaddlePos.top  && currentBallPos.y + BallSize <= RightPaddlePos.bottom) || (currentBallPos.y <= RightPaddlePos.bottom && currentBallPos.y >= RightPaddlePos.top))
	// // 	}
	// // }

	// private checkCollision(){
	// 	if (paddleCollision())
	// }

	// @SubscribeMessage("moveball")
	// 	moveball(client: Socket){

	// 		this.BallPos = {
	// 			x: this.BallPos.x + this.BallDir.x,
	// 			y: this.BallPos.y + this.BallDir.y
	// 		}
	// 		this.server.to(client.id).emit("moveball", this.BallPos)
	// 	}
	@SubscribeMessage("paddlemove")
		handlePaddleMove(client: Socket, args: string)
		{
			let game: PongGame;

			this.PongService.activeGames.forEach((element) => {
				if (element.isMyPlayer(client)){
					game = element;
				}
			});

			if (game) {
				const player = game.isMyHost(client) ? game.LeftPlayer : game.RightPlayer
				const enemyPlayer = player === game.LeftPlayer ? game.RightPlayer : game.LeftPlayer

				args === "up" ? player.moveUp() : player.moveDown()

				this.server.to(enemyPlayer.getSocket().id).emit("enemyMove", args, player.getPaddlePos()) // args = up or down; 1080/100 = mouvement of the paddle (1% of the poung size to resize in the front)
			}
		}

	@SubscribeMessage("getPos")
		handleReRender(client: Socket){
			let game: PongGame;

			this.PongService.activeGames.forEach((element) => {
				if (element.isMyPlayer(client)){
					game = element;
				}
			});

			if (game)
			{
				if(game.isMyHost(client))
					this.server.to(client.id).emit("receivePos", game.LeftPlayer.getPaddlePos(), game.RightPlayer.getPaddlePos())
				else
					this.server.to(client.id).emit("receivePos", game.RightPlayer.getPaddlePos(), game.LeftPlayer.getPaddlePos())
			}
		}

	@SubscribeMessage("resetBall")
		resetBall(client: Socket){
		// 	this.BallPos = {
		// 		x: this.PongBounds.width / 2,
		// 		y: this.PongBounds.height / 2
		// 	}
		// 	let phi: number; 
		// 	do {
		// 		phi = 2*Math.PI*Math.random();
		// 	} while ((phi >= Math.PI / 3 && phi <= 2 * Math.PI / 3) || (phi >= 4 * Math.PI / 3 && phi <= 5 * Math.PI / 3))
		// 	this.BallDir = {
		// 		x: Math.cos(phi) * 5,
		// 		y: Math.sin(phi) * 5
		// 	}
			
		// 	console.log("reset game init : ", this.BallPos, this.BallDir)
		// 	this.server.to(client.id).emit("resetBall", this.BallPos, this.BallDir)
		// }
	}
}
// reception de challenge

// envie de spectate

// receive de la direction de la ball ----> (voir gerer la pos du back ici meme)

// receive de la pos du paddle enemi ---> (voir gerer les moove des deux paddles)

// receive de score

// receive de la victoire ou defaite 

// 



// requete post game if(une game en attende rejoins) else(cree une game en attende)