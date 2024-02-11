import {WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket} from "@nestjs/websockets";
import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException, UseGuards } from '@nestjs/common';

import { Server, Socket } from "socket.io";

import { PongService } from "./pong.service";
import { PongGame, Player, Ball } from "./game";

import { UsersService } from "src/auth/services/users.service";

import { AppService } from "src/app.service";

import { GameStatus, MatchResult, Prisma, UserStatus } from "@prisma/client";
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
				private UserService: UsersService,
				private appService: AppService
				) {}

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
			const enemy = game.LeftPlayer.getSocket() === client ? game.RightPlayer : game.LeftPlayer
			this.server.to(enemy.getSocket().id).emit("decoInGame", "player")
			game.watcher.forEach((e) =>{
				this.server.to(e.id).emit("decoInGame", "watcher")
			})
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
				this.searchingUsersMedium.delete(key);
				return; 
			}
		});
		this.searchingUsersHard.forEach((value, key) => {
			if (value === client) {
				this.searchingUsersHard.delete(key);
				return; 
			}
		});
	}

	@SubscribeMessage("cancelSearching")
		async handleCancelSearching(client: Socket, userId: number)
		{
			this.delUserFromSearchingUser(client)
			await this.PongService.updateStatusUser(userId, UserStatus.ONLINE)
		}
	
	async toSearchingArray(client: Socket, userId: number, dif: number){
		
		let array: Map<number, Socket>

		if (dif === 1)
			array = this.searchingUsersEz
		if (dif === 2)
			array = this.searchingUsersMedium 
		if (dif === 3)
			array = this.searchingUsersHard

		if (!array)
			throw new Error("Incorrect value for difficulty")

		array.set(userId, client)

		await this.PongService.updateStatusUser(userId, UserStatus.WAITING) // need protect
	}


	async launchGame(id: number, enemyId: number, dif: number,  messageId? :number)
	{
		const leftSocket = AppService.connectedUsers.get(id.toString())
		const rightSocket = AppService.connectedUsers.get(enemyId.toString())

		if (leftSocket === undefined || rightSocket === undefined)
			throw new Error("One of the player is offline")

		const leftUser = await this.UserService.findById(id)
		const rightUser = await this.UserService.findById(enemyId)

		const newgame = await this.PongService.createGame(id, enemyId);
		if (leftSocket && rightSocket)
		{
		this.server.to(leftSocket.id).emit("launchGame")
		this.server.to(rightSocket.id).emit("launchGame")

		this.PongService.activeGames.push(new PongGame(newgame, dif, leftSocket, id, leftUser.username, rightSocket, enemyId, rightUser.username, messageId))

		this.gameLoop(leftSocket, rightSocket, this.PongService.activeGames[this.PongService.activeGames.length - 1])

		this.delUserFromSearchingUser(leftSocket)
		this.delUserFromSearchingUser(rightSocket)
		}
		else
		{
			console.log("error launchGame")
			return
		}
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

		if(!array)
			throw new Error("Incorrect value for difficulty")

		let keysIterator  = array.keys()
		let keysArray = Array.from(keysIterator);
		let firstkey = keysArray[0]
		
		if (array.size >= 2)
		{
			let secondkey = keysArray[1]

			let firstsocket = array.get(firstkey)
			let secondsocket = array.get(secondkey)

			this.launchGame(firstkey, secondkey, dif)
		}

	}

	/*
		data[0] = id user
		data[1] = niveau difficulter entre 1 et 3
	*/
	
	@SubscribeMessage('searchGame')
	async addSearchingPlayer(client: Socket, data: number) {
		try {	
			if( !data || !data[0] || !data[1])
				throw new Error("an Error occur from the WebSocket")	

			this.toSearchingArray(client, data[0], data[1])
			await this.checkToLaunchGame(client, data[1])

		}
		catch (error: any) {
			this.server.to(client.id).emit("error", error.message)
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
				let idOfWatcher  = game.watcher.keys()
				let keysArray = Array.from(idOfWatcher);
				keysArray.forEach((e) =>{
					this.PongService.updateStatusUser(e, UserStatus.ONLINE)
				})
				this.PongService.updateGameStatus(game.id, GameStatus.FINISHED)
				if (game.messageId)
				{
					this.PongService.setInvitationAsFinished(game.messageId)
					
				}
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
			try{
				if (args !== "up" && args !== "down")
					throw new Error("wrong movement")
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
			catch(error: any){
				this.server.to(client.id).emit("error", error.message)
			}
		}

		@SubscribeMessage("spectate")
			async handleSpectate(client: Socket, data: any)
			{
				try {
					if(!data || !data[0] || !data[1])
						throw new Error("Unable to retrive the needed data")
					let game: PongGame
					this.PongService.activeGames.forEach((element) => {
						if (element.isMyPlayerById(data[1])){
							game = element;
						}
					});
					if(game)
					{
            			const oldStatus = await this.PongService.getUserStatus(data[0])
						if (oldStatus == UserStatus.OFFLINE || oldStatus == UserStatus.PLAYING || oldStatus == UserStatus.WATCHING || oldStatus == UserStatus.WAITING)
						{
							console.log("oldStatus2 = ", oldStatus)
							throw new Error('Unable to process watching')
							return
						}
						const tmp = client
						game.addWatcher(data[0], tmp)
						await this.PongService.updateStatusUser(data[0], UserStatus.WATCHING)
						this.server.to(client.id).emit("spectate")
					}
				}
				catch(error: any){
					this.server.to(client.id).emit("error", error.message)
				}
			}

		@SubscribeMessage("stopSpectate")
			async handleStopSpectate(client: Socket, data: number)
			{
				try {
					if(!data || !data[0] || !data[1])
						throw new Error("Unable to retrive the needed data")
					let game: PongGame
					this.PongService.activeGames.forEach((element) => {
						if (element.id === data[0]){
							game = element;
						}
					});
					if (game)
					{
						await this.PongService.updateStatusUser(data[1], UserStatus.ONLINE)
						// const index = game.watcher.indexOf(client)
						// if(index != -1)
						// 	game.watcher.splice(index,1)
						game.removeWatcher(data[1])
					}
				}
				catch(error: any){
					this.server.to(client.id).emit("error", error.message)
				}
			}
}

// need : 

	// ...	

// bugs :

	// les possible element du pongWrapper peuvent se voir si on retrecie bcp le pong


// protect :

	// matchmaking

	// spectate

	//challenge