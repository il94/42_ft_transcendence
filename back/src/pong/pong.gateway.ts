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
	 
	private searchingUsersEz: Map<number, Socket> = new Map();
	private searchingUsersMedium: Map<number, Socket> = new Map();
	private searchingUsersHard: Map<number, Socket> = new Map();
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
		if (game)
		{
			// console.log("gonna delete game because of disconnect")
			const enemy = game.LeftPlayer.getSocket() === client ? game.RightPlayer : game.LeftPlayer 
			// this.server.to(client.id).emit("decoInGame", "you")
			this.server.to(enemy.getSocket().id).emit("decoInGame")
			enemy.setWinner()
			game.setState(false)
			return
		}
		this.delUserFromSearchingUser(client)
	}

	delUserFromSearchingUser(client: Socket)
	{
		this.searchingUsersEz.forEach((value, key) => {
			if (value === client) {
				this.searchingUsersEz.delete(key);
				return;
			}
		});
		this.searchingUsersMedium.forEach((value, key) => {
			if (value === client) {
				this.searchingUsersEz.delete(key);
				return; 
			}
		});
		this.searchingUsersHard.forEach((value, key) => {
			if (value === client) {
				this.searchingUsersEz.delete(key);
				return; 
			}
		});
	} // fct degeu :/

	async toSearchingArray(client: Socket, userId: number, dif: number){
		
		let array: Map<number, Socket>

		if (dif === 1)
			array = this.searchingUsersEz
		if (dif === 2)
			array = this.searchingUsersMedium 
		if (dif === 3)
			array = this.searchingUsersHard

			if (array.get(userId)){
				array.delete(userId)
				await this.PongService.updateStatusUser(userId, UserStatus.ONLINE)
				return
				// throw new ConflictException('User already in game')
			}
		array.set(userId, client)
		await this.PongService.updateStatusUser(userId, UserStatus.WAITING)

	}

	async checkToLaunchGame(client: Socket, dif: number)
	{
		let array: Map<number, Socket>
		if (dif === 1)
			array = this.searchingUsersEz
		if (dif === 2)
			array = this.searchingUsersMedium 
		if (dif === 3)
			array = this.searchingUsersHard

		let keysIterator  = array.keys()
		let keysArray = Array.from(keysIterator);
		let firstkey = keysArray[0]
		
		if (array.size >= 2)
		{
			let secondkey = keysArray[1]

			let firstsocket = array.get(firstkey)
			let secondsocket = array.get(secondkey)

			const user1 = this.UserService.findById(firstkey)
			const user2 = this.UserService.findById(secondkey)

			this.server.to(firstsocket.id).emit("launchGame")
			this.server.to(secondsocket.id).emit("launchGame")

			const newgame = await this.PongService.createGame(firstkey, secondkey);

			this.PongService.activeGames.push(new PongGame(newgame, dif, firstsocket, firstkey, (await user1).username, secondsocket, secondkey, (await user2).username))
			this.gameLoop(firstsocket, secondsocket, this.PongService.activeGames[this.PongService.activeGames.length - 1])

			for (let [key, value] of array.entries()) {
				if (value === firstsocket || value === secondsocket) {
					array.delete(key);
				}
			}
		}

	}
	
	@SubscribeMessage('searchGame')
	async addSearchingPlayer(client: Socket, data: any) {
		try {			

			this.toSearchingArray(client, data[0], data[1])

			await this.checkToLaunchGame(client, data[1])

		} catch (error) {
			//throw error
		}
	}

	gameLoop(host: Socket, guest: Socket, game: PongGame){
		const speed = 30 / game.difficulty
		setTimeout(() =>{
			game.moveBall()
			
			const ball = game.Ball.getPos()

			const reverseball = {
				x: 1920 - (ball.x),
				y: (ball.y)
			}

			this.server.to(host.id).emit("pongInfo", game.id, ball, game.LeftPlayer.name, game.LeftPlayer.getPos(), game.RightPlayer.name, game.RightPlayer.getPos(),game.LeftPlayer.getScore(), game.RightPlayer.getScore())
			this.server.to(guest.id).emit("pongInfo", game.id, reverseball, game.RightPlayer.name, game.RightPlayer.getPos(), game.LeftPlayer.name, game.LeftPlayer.getPos(), game.RightPlayer.getScore(), game.LeftPlayer.getScore())
			game.watcher.forEach((e) =>{
				this.server.to(e.id).emit("pongInfo", game.id, ball, game.LeftPlayer.name, game.LeftPlayer.getPos(), game.RightPlayer.name, game.RightPlayer.getPos(), game.LeftPlayer.getScore(), game.RightPlayer.getScore())
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
				
				this.PongService.updateStatusUser(winner.id, UserStatus.ONLINE)
				this.PongService.updateStatusUser(looser.id, UserStatus.ONLINE)
				this.PongService.updateGameStatus(game.id, GameStatus.FINISHED)

				const index = this.PongService.activeGames.indexOf(game)
				if (index != -1)
					this.PongService.activeGames.splice(index, 1)
				console.log("game finsihed, game still active : ", this.PongService.activeGames.length)
			}
		}, speed)

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
			async handleSpectate(client: Socket, data: any)
			{
				let game: PongGame
				this.PongService.activeGames.forEach((element) => {
					if (element.isMyPlayerById(data[1])){
						game = element;
					}
				});
				if(game)
				{
					const tmp = client
					game.addWatcher(tmp)
					await this.PongService.updateStatusUser(data[0], UserStatus.WATCHING)
					this.server.to(client.id).emit("spectate")
				}
				// this.watchingUsers.set(data[0], client)
			}

		@SubscribeMessage("stopSpectate")
			async handleStopSpectate(client: Socket, data: number)
			{
				let game: PongGame
				this.PongService.activeGames.forEach((element) => {
					if (element.id === data[0]){
						game = element;
					}
				});
				if (game)
				{
					await this.PongService.updateStatusUser(data[1], UserStatus.ONLINE)
					const index = game.watcher.indexOf(client)
					if(index != -1)
						game.watcher.splice(index,1)
				}
			}
}

// need : 

	// winner and looser screen at end need style

	// cooldown at start ? 

	// ...

	// enlever le waiting quand on cherche plus 
	

// bugs :

	// les possible element du pongWrapper peuvent se voir si on retrecie bcp le pong

	// le inspect de la page clc

	// bug status peut etre moi


