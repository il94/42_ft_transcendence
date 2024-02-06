import {WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket} from "@nestjs/websockets";
import { ConflictException, Search } from "@nestjs/common";

import { Server, Socket } from "socket.io";

import { PongService } from "./pong.service";
import { PongGame, Player, Ball } from "./game";

import { UsersService } from "src/auth/services/users.service";

import { disconnect } from "process";
import { GameStatus, MatchResult, UserStatus } from "@prisma/client";
import { subscribe } from "diagnostics_channel";


@WebSocketGateway()
export class PongGateway {
	
	@WebSocketServer()
	server: Server;
	 
	private searchingUsers: Map<number, Socket> = new Map();
	// private watchingUsers: Map<number, Socket> = new Map(); // a teg

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
			const enemy = game.LeftPlayer.getSocket() === client ? game.RightPlayer : game.LeftPlayer 
			// this.server.to(client.id).emit("decoInGame", "you")
			this.server.to(enemy.getSocket().id).emit("decoInGame")
			enemy.setWinner()
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
			
				console.log("user1.usernme", (await user1).username)
				console.log("user2.usernme", (await user2).username)

				this.PongService.activeGames.push(new PongGame(newgame, firstsocket, firstkey,  (await user2).username, secondsocket, secondkey, (await user2).username))
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
			//watcher from prisma or 
			// for (let [key, value] of this.watchingUsers.entries()) {
			// 	this.server.to(value.id).emit("pongInfo", ball, game.LeftPlayer.getPos(), game.RightPlayer.getPos(),game.LeftPlayer.getScore(), game.RightPlayer.getScore())
			// }
			game.watcher.forEach((e) =>{
				this.server.to(e.id).emit("pongInfo", ball, game.LeftPlayer.getPos(), game.RightPlayer.getPos(),game.LeftPlayer.getScore(), game.RightPlayer.getScore())
			})
			game.checkScore()
			if (game.getState())
				this.gameLoop(host, guest, game)
			else
			{
				game.SetTheWinner()
				const winner = game.LeftPlayer.winner ? game.LeftPlayer : game.RightPlayer // return PLayer instance (need socket id ? name ?)
				const looser = game.LeftPlayer.winner ? game.RightPlayer : game.LeftPlayer
				this.PongService.updateUserGameStats(winner.id, game.id, winner.getScore(), MatchResult.WINNER)
				this.PongService.updateUserGameStats(looser.id, game.id, looser.getScore(), MatchResult.LOOSER)
				const index = this.PongService.activeGames.indexOf(game)
				if (index != -1)
					this.PongService.activeGames.splice(index, 1)
				console.log("game finsihed, game still active : ", this.PongService.activeGames.length)
				this.PongService.updateGameStatus(game.id, GameStatus.FINISHED)
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

		@SubscribeMessage("spectate")
			handleSpectate(client: Socket, data: any)
			{
				let game: PongGame
				console.log("data[0]", data[0])
				console.log("data[1]", data[1])
				console.log("data", data)
				this.PongService.activeGames.forEach((element) => {
					if (element.isMyPlayerById(data[1])){
						game = element;
					}
				});
				if(game)
				{
					const tmp = client
					game.addWatcher(tmp)
					this.server.to(client.id).emit("spectate")
				}
				// this.watchingUsers.set(data[0], client)
			}
}

// need : 

	// winner and looser screen at end need style

	// cooldown at start ?

	// route : create game, finish game, add a spectator ?  

	// ...

// bugs :

	// game freeze --> a cause de modif du code ou qunad je regarde pas les pages pendant un certatin temps (je  crois)

	// les possible element du pongWrapper peuvent se voir si on retrecie bcp le pong

	// le inspect de la page clc
