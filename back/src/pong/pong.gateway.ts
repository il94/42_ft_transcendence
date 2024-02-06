import {WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket} from "@nestjs/websockets";
import { ConflictException, Search } from "@nestjs/common";

import { Server, Socket } from "socket.io";

import { AppService } from 'src/app.service';
import { PongService } from "./pong.service";
import { lstat } from "fs";
import { PongGame, Player, Ball } from "./game";
import { subscribe } from "diagnostics_channel";

import { UsersService } from "src/auth/services/users.service";
import { disconnect } from "process";
import { UserStatus } from "@prisma/client";

@WebSocketGateway()
export class PongGateway {
	
	@WebSocketServer()
	server: Server;
	 
	private searchingUsers: Map<number, Socket> = new Map();

	constructor(private  PongService: PongService,
				private UserService: UsersService) {}

	handleConnection(client: Socket){
		console.log("connection of :", client.id)
	}

	// beforeDisconnect(client: Socket, reason: string) {
	// 	// This method is called before a client disconnects
	// 	this.handleDeconnection(client);
	//  }
	
	handleDisconnect(client: Socket){
		let game: PongGame;

			this.PongService.activeGames.forEach((element) => {
				if (element.isMyPlayer(client)){
					game = element;
				}
			});
		console.log("deconnection of :", client.id, " !!! ")
		if (game)
		{
			console.log("gonna delete game because of disconnect")
			const enemy = game.LeftPlayer.getSocket() === client ? game.RightPlayer.getSocket() : game.LeftPlayer.getSocket() 
			// this.server.to(client.id).emit("decoInGame", "you")
			this.server.to(enemy.id).emit("decoInGame")
			game.setState(false)
			// const index = this.PongService.activeGames.indexOf(game)
			// this.PongService.activeGames.splice(index, 1)
			// soso Patch Game
		}
	}
	
	@SubscribeMessage('searchGame')
	async addSearchingPlayer(client: Socket, data: any) {
		try {			
			if (this.searchingUsers.get(data)){
				this.searchingUsers.delete(data)
				await this.PongService.updateStatusUser(data, UserStatus.ONLINE)
				console.log("is now out of search")
				return
				// throw new ConflictException('User already in game')
			}

			this.searchingUsers.set(data, client)
			console.log("is now in search")
			await this.PongService.updateStatusUser(data, UserStatus.WAITING)
			let keysIterator  = this.searchingUsers.keys()
			let keysArray = Array.from(keysIterator);
			let firstkey = keysArray[0]

			if (this.searchingUsers.size >= 2)
			{		
				let secondkey = keysArray[1]

				let firstsocket = this.searchingUsers.get(firstkey)
				let secondsocket = this.searchingUsers.get(secondkey)

				// recup l'user authenticate de l'enemi pour l'envoyer au front ?

				const user1 = this.UserService.findById(firstkey)
				const user2 = this.UserService.findById(secondkey)

				this.server.to(firstsocket.id).emit("launchGame", user2)
				this.server.to(secondsocket.id).emit("launchGame", user1)
				// POST la game et gerer le status des joueurs et recupere l'id newgame
				const newgame = await this.PongService.createGame(firstkey, secondkey);

				this.PongService.activeGames.push(new PongGame(firstsocket, secondsocket))

				for (let [key, value] of this.searchingUsers.entries()) {
					if (value === firstsocket || value === secondsocket) {
						this.searchingUsers.delete(key);
					}
				} //delete Searchinguser after finding a game
				console.log("size of map searchinguser", this.searchingUsers.size)
				this.gameLoop(firstsocket, secondsocket, this.PongService.activeGames[this.PongService.activeGames.length - 1])

					// console.log("map size", this.searchingUsers.size)
					// console.log("in back", secondkey)
					// console.log("in back", firstkey)

				// this.searchingUsers.delete(firstkey)
				// this.searchingUsers.delete(secondkey)
			}
		} catch (error) {
			//throw error
		}
	}

	gameLoop(host: Socket, guest: Socket, game: PongGame){
		setTimeout(() =>{
			game.moveBall()
			
			const ball = game.Ball.getPos()

			const reverseball = {
				x: 1920 - (ball.x),
				y: (ball.y)
			}

			this.server.to(host.id).emit("ballInfo", ball, game.LeftPlayer.getScore(), game.RightPlayer.getScore())
			this.server.to(guest.id).emit("ballInfo", reverseball, game.RightPlayer.getScore(), game.LeftPlayer.getScore())
			game.checkScore()
			if (game.getState())
				this.gameLoop(host, guest, game)
			else
			{
				const winner = game.getTheWinner() // return PLayer need socket id ? name ?
				const index = this.PongService.activeGames.indexOf(game)
				if (index != -1)
					this.PongService.activeGames.splice(index, 1)
				console.log("game finsihed, game still active : ", this.PongService.activeGames.length)
				// soso Patch Game finish et les score
				//route base de donner le winner
			}
		}, 30)

	} //async

	@SubscribeMessage("getBallInfo")
		handleBallInfo(client: Socket){
			let game: PongGame;

			this.PongService.activeGames.forEach((element) => {
				if (element.isMyPlayer(client)){
					game = element;
				}
			});
			if (game)
			{
				const host = game.isMyHost(client) ? game.LeftPlayer : game.RightPlayer
				const guest = host === game.LeftPlayer ? game.RightPlayer : game.LeftPlayer
				
				this.server.to(client.id).emit("ballInfo", game.Ball.getPos(), 0, 0)
			}
		}
		
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

				this.server.to(enemyPlayer.getSocket().id).emit("enemyMove", args, player.getPos()) // args = up or down; 1080/100 = mouvement of the paddle (1% of the poung size to resize in the front)
			}
		}

	@SubscribeMessage("reRender")
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
					this.server.to(client.id).emit("receivePos", game.LeftPlayer.getPos(), game.RightPlayer.getPos())
				else
				this.server.to(client.id).emit("receivePos", game.RightPlayer.getPos(), game.LeftPlayer.getPos())
		}
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

	// @SubscribeMessage("score")
	// // handleScore(@MessageBody() data: string, @ConnectedSocket() client: Socket, args: any){
	// 	handleScore(client: Socket, args: any){
	// 		const clientID = client.id;
			
	// 		console.log("Score : ", args)
	// 		// if (parseInt(args[0]) >= 11 || parseInt(args[1]) >= 11) // check the score finish game
	// 		this.server.to(client.id).emit('score', client.id, args)
			
	// 	}
		
		
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
// 	@SubscribeMessage("resetBall")
// 		resetBall(client: Socket){
// 		// 	this.BallPos = {
// 		// 		x: this.PongBounds.width / 2,
// 		// 		y: this.PongBounds.height / 2
// 		// 	}
// 		// 	let phi: number; 
// 		// 	do {
// 		// 		phi = 2*Math.PI*Math.random();
// 		// 	} while ((phi >= Math.PI / 3 && phi <= 2 * Math.PI / 3) || (phi >= 4 * Math.PI / 3 && phi <= 5 * Math.PI / 3))
// 		// 	this.BallDir = {
// 		// 		x: Math.cos(phi) * 5,
// 		// 		y: Math.sin(phi) * 5
// 		// 	}
			
// 		// 	console.log("reset game init : ", this.BallPos, this.BallDir)
// 		// 	this.server.to(client.id).emit("resetBall", this.BallPos, this.BallDir)
// 		// }
// 	}
// }
// reception de challenge

// envie de spectate

// receive de la direction de la ball ----> (voir gerer la pos du back ici meme)

// receive de la pos du paddle enemi ---> (voir gerer les moove des deux paddles)

// receive de score

// receive de la victoire ou defaite 

// 



// requete post game if(une game en attende rejoins) else(cree une game en attende)