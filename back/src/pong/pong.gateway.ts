import {WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket} from "@nestjs/websockets";
import { ConflictException, Search } from "@nestjs/common";

import { Server, Socket } from "socket.io";

import { PongService } from "./pong.service";
import { PongGame, Player, Ball } from "./game";

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
		//console.log("connection of :", client.id)
	}

	handleDisconnect(client: Socket){
		let game: PongGame;

			this.PongService.activeGames.forEach((element) => {
				if (element.isMyPlayer(client)){
					game = element;
				}
			});
		// console.log("deconnection of :", client.id, " !!! ")
		if (game)
		{
			// console.log("gonna delete game because of disconnect")
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

				const user1 = this.UserService.findById(firstkey)
				const user2 = this.UserService.findById(secondkey)

				this.server.to(firstsocket.id).emit("launchGame", user2)
				this.server.to(secondsocket.id).emit("launchGame", user1)
				// POST la game et gerer le status des joueurs et recupere l'id newgame
				const newgame = await this.PongService.createGame(firstkey, secondkey);

			
				this.PongService.activeGames.push(new PongGame(firstsocket, firstkey, secondsocket, secondkey))
				for (let [key, value] of this.searchingUsers.entries()) {
					if (value === firstsocket || value === secondsocket) {
						this.searchingUsers.delete(key);
					}
				} //delete Searchinguser after finding a game
				// console.log("size of map searchinguser", this.searchingUsers.size)
				this.gameLoop(firstsocket, secondsocket, this.PongService.activeGames[this.PongService.activeGames.length - 1])
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

			this.server.to(host.id).emit("pongInfo", ball, game.LeftPlayer.getPos(), game.RightPlayer.getPos(),game.LeftPlayer.getScore(), game.RightPlayer.getScore())
			this.server.to(guest.id).emit("pongInfo", reverseball, game.RightPlayer.getPos(), game.LeftPlayer.getPos(), game.RightPlayer.getScore(), game.LeftPlayer.getScore())
			game.checkScore()
			if (game.getState())
				this.gameLoop(host, guest, game)
			else
			{
				const winner = game.getTheWinner() // return PLayer instance (need socket id ? name ?)
				const index = this.PongService.activeGames.indexOf(game)
				if (index != -1)
					this.PongService.activeGames.splice(index, 1)
				console.log("game finsihed, game still active : ", this.PongService.activeGames.length)
				// soso Patch Game finish et les score
				//route base de donner le winner

			}
		}, 30)

	}
	@SubscribeMessage("getPongInfo") 
		handleBallInfo(client: Socket){
			let game: PongGame;

			this.PongService.activeGames.forEach((element) => {
				if (element.isMyPlayer(client)){
					game = element;
				}
			});
			if (game)
			{
				const player = game.isMyHost(client) ? game.LeftPlayer : game.RightPlayer
				const enemy = player === game.LeftPlayer ? game.RightPlayer : game.LeftPlayer
				
				this.server.to(client.id).emit("pongInfo", game.Ball.getPos(), player.getPos(), enemy.getPos(), 0, 0)
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
				args === "up" ? player.moveUp() : player.moveDown()
			}
		}
}

// need : 

	// spectate mode

	// winner and looser screen at end

	// cooldown at start ?

	// bouton spectate

	// route : create game, finish game, add a spectator ?  

	// ...

// bugs :

	// game freeze --> a cause de modif du code ou qunad je regarde pas les pages pendant un certatin temps (je  crois)

	// les possible element du pongWrapper peuvent se voir si on retrecie bcp le pong