import {WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket} from "@nestjs/websockets";
import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException, UseGuards } from '@nestjs/common';

import { Server, Socket } from "socket.io";

import { PongService } from "./pong.service";
import { PongGame, Player, Ball } from "./game";

import { UsersService } from "src/auth/services/users.service";

import { AppService } from "src/app.service";

import { GameStatus, MatchResult, Prisma, UserStatus } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";


@WebSocketGateway()
export class PongGateway {
	
	@WebSocketServer()
	server: Server;
	 
	private searchingUsersEz: Map<number, Socket> = new Map();
	private searchingUsersMedium: Map<number, Socket> = new Map();
	private searchingUsersHard: Map<number, Socket> = new Map();
	// private watchingUsers: Map<number, Socket> = new Map(); // a teg

	constructor(private prisma: PrismaService,
				private PongService: PongService,
				private UserService: UsersService,
				private appService: AppService
				) {}

	handleConnection(client: Socket){
		// console.log("connection of :", client.id)
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

	handlePrevArrow()
	{
		// let game: PongGame = null
		// let map: Map<string, Socket>
		// let id: number = -1
		// let l_ok: boolean = false
		// let r_ok: boolean = false

		// map = AppService.connectedUsers
		// this.PongService.activeGames.forEach((g) => {
		// 	map.forEach((socket, key) => {
		// 		if (g.LeftPlayer.id == parseInt(key))
		// 			l_ok = true
		// 		if(g.RightPlayer.id == parseInt(key)){
		// 			r_ok = true
		// 		}
		// 	})
		// 	if (!l_ok || !r_ok)
		// 		id = parseInt(key)
		// });
		// if (game)
		// {
		// 	console.log("je rentre dans le if de la game")
		// 	const you = game.LeftPlayer.id === id ? game.LeftPlayer : game.RightPlayer
		// 	const enemy = game.LeftPlayer.id === id ? game.RightPlayer : game.LeftPlayer
		// 	console.log("your socket id", you.id)
		// 	console.log("your enemy id", enemy.id)
		// 	if (you)
		// 	this.server.to(enemy.getSocket().id).emit("decoInGame", "player")
		// 	game.watcher.forEach((e) =>{
		// 		this.server.to(e.id).emit("decoInGame", "watcher")
		// 	})
		// 	enemy.setWinner()
		// 	game.setState(false)
		// 	this.delUserFromSearchingUser(you.getSocket())
		// }
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

	async handleCancelSearching(userId: number)
	{
		try {

			const socketUser = AppService.connectedUsers.get(userId.toString())
			if(socketUser)
			{
				this.delUserFromSearchingUser(socketUser)
				await this.PongService.updateStatusUser(userId, UserStatus.ONLINE)
			}
		}
		catch (error) {
			throw error
		}
	}
	
	async toSearchingArray(userId: number, dif: number){
		try {
			let array: Map<number, Socket>
			if (dif === 1)
				array = this.searchingUsersEz
			if (dif === 2)
				array = this.searchingUsersMedium 
			if (dif === 3)
				array = this.searchingUsersHard

			if (!array)
				throw new Error("Incorrect value for difficulty")

			const socketUser = AppService.connectedUsers.get(userId.toString())
			if (socketUser)
				array.set(userId, socketUser)

			await this.PongService.updateStatusUser(userId, UserStatus.WAITING) // need protect
		} catch (error) {
            if (error instanceof ForbiddenException || error instanceof NotFoundException)
                throw error
            else if (error instanceof Prisma.PrismaClientKnownRequestError)
                throw new ForbiddenException("The provided user data is not allowed")
            else
                throw new BadRequestException()
        }
	}


	async launchGame(id: number, enemyId: number, dif: number,  messageId? :number)
	{
		try {
			const leftSocket = AppService.connectedUsers.get(id.toString())
		const rightSocket = AppService.connectedUsers.get(enemyId.toString())

		if (leftSocket === undefined || rightSocket === undefined)
			return
	
		if (leftSocket && rightSocket)
		{
			const leftUser = await this.UserService.findById(id)
			const rightUser = await this.UserService.findById(enemyId)
	
			const newgame = await this.PongService.createGame(id, enemyId);
			this.server.to(leftSocket.id).emit("launchGame")
			this.server.to(rightSocket.id).emit("launchGame")

			if (dif)
				this.PongService.activeGames.push(new PongGame(newgame, dif, leftSocket, id, leftUser.username, rightSocket, enemyId, rightUser.username, messageId))

			this.gameLoop(leftSocket, rightSocket, this.PongService.activeGames[this.PongService.activeGames.length - 1])

			this.delUserFromSearchingUser(leftSocket)
			this.delUserFromSearchingUser(rightSocket)

		}
		}catch (error) {
			if (error instanceof ForbiddenException || error instanceof NotFoundException|| error instanceof ConflictException)
				throw error
			else if (error instanceof Prisma.PrismaClientKnownRequestError)
				throw new ForbiddenException("The provided credentials are not allowed")
			else
				throw new BadRequestException()
		}
		
	}

	async checkToLaunchGame(id: number, dif: number)
	{
		try {
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

			await this.launchGame(firstkey, secondkey, dif)
		}
		} catch (error) {
            if (error instanceof ForbiddenException || error instanceof NotFoundException)
                throw error
            else if (error instanceof Prisma.PrismaClientKnownRequestError)
                throw new ForbiddenException("The provided user data is not allowed")
            else
                throw new BadRequestException()
        }
		

	}

	async addSearchingPlayer(userId: number, dif: number) {
		try {	
			const pendingGamesOne = await this.prisma.game.findMany({
				where: {
				  players: {
					some: {
					  userId: userId
					}
				  },
				  status: GameStatus.PENDING
				}
			  });
			if (pendingGamesOne.length != 0 )
			  throw new ForbiddenException("User already in game")
			if(!dif || dif < 1 || dif > 3)
				throw new BadRequestException("an Error occur from the WebSocket")	
      
			this.toSearchingArray(userId, dif)
			await this.checkToLaunchGame(userId, dif)

		}
		catch (error) {
			if (error instanceof ForbiddenException || error instanceof NotFoundException|| error instanceof ConflictException)
				throw error
			else if (error instanceof Prisma.PrismaClientKnownRequestError)
				throw new ForbiddenException("The provided credentials are not allowed")
			else
				throw new BadRequestException()
		}
	}

	gameLoop(host: Socket, guest: Socket, game: PongGame){
		// const speed = 20 / game.difficulty
		let speed: number = 0
		if (game.difficulty == 1)
			speed = 10
		else if (game.difficulty == 2)
			speed = 6
		else if (game.difficulty == 3) 
			speed = 3
		else
			speed = 12
		
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
				// console.log("game finsihed, game still active : ", this.PongService.activeGames.length)
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

	async	handleBack(userId : number)
	{
		try {

			  const user = await this.prisma.user.findUnique({
				where : {
					id : userId
				}
			  })
			  await this.PongService.cancelAllInvitation(user.id);
			//   console.log("user status = ", user.status)
			  if (user.status === UserStatus.WAITING)
			  {
			  	this.delUserFromSearchingUser(AppService.connectedUsers.get(userId.toString()));
			  	await this.PongService.updateStatusUser(userId, UserStatus.ONLINE);
				return
			  }
			  const pendingGames = await this.prisma.game.findFirst({
				where: {
					players: {
						some: {
							userId: userId,
						},
					},
					status: GameStatus.PENDING,
				}
			});
			if (user.status === UserStatus.WATCHING)
			{
				let game: PongGame

				this.PongService.activeGames.forEach((element) => {
					if (element.isAWatcherById(userId) === true){
						game = element
					}
				});
				if (game)
					this.handleStopSpectate(userId, game.id)
				await this.PongService.updateStatusUser(userId, UserStatus.ONLINE);
			  	return
			}

			  if (pendingGames)
			  {
				let game : PongGame = null;
				this.PongService.activeGames.forEach((element) => {
					if (element.isMyPlayer(AppService.connectedUsers.get(userId.toString()))){
						game  = element;
					}
				});
		
				  const enemy = game.LeftPlayer.getSocket() === AppService.connectedUsers.get(userId.toString())? game.RightPlayer : game.LeftPlayer
				  this.server.to(enemy.getSocket().id).emit("decoInGame", "player")
				  game.watcher.forEach((e) =>{
					  this.server.to(e.id).emit("decoInGame", "watcher")
				  })
				  enemy.setWinner()
				  game.setState(false)
				  return
			  }
		}
		catch(error: any){
			const socketUser =  AppService.connectedUsers.get(userId.toString())
			if (socketUser)
				this.server.to(socketUser.id).emit("error", error.message)
		}
	}


	
	
	async handleSpectate(UserId: number, spectateId : number)
	{
		try {
			if(!UserId || !spectateId)
				throw new BadRequestException()

			// Verifie si le user auth est online
			const userStatus = await this.prisma.user.findUnique({
				where: {
					id: UserId
				},
				select: {
					status: true
				}
			})
			if (userStatus.status !== UserStatus.ONLINE)
				throw new ForbiddenException("You can't execute this action")

			// Verifie si le user existe et récupère son role
			const user = await this.prisma.user.findUnique({
				where: {
					id: spectateId
				},
				select: {
					status: true
				}
			})
			if (!user)
				throw new NotFoundException("User not found")
			else if (user.status !== UserStatus.PLAYING)
				throw new ForbiddenException("User is not playing")

			let game: PongGame
			this.PongService.activeGames.forEach((element) => {
				if (element.isMyPlayerById(spectateId)){ 
					game = element;
				}
			});
			if(game)
			{
				// const oldStatus = await this.PongService.getUserStatus(UserId)
				// if (oldStatus == UserStatus.OFFLINE || oldStatus == UserStatus.PLAYING || oldStatus == UserStatus.WATCHING || oldStatus == UserStatus.WAITING)
				// {
				// 	console.log("oldStatus2 = ", oldStatus)
				// 	throw new Error('Unable to process watching')
				// 	return
				// }
				const socketUser = AppService.connectedUsers.get(UserId.toString())
				if (socketUser)
				{	
					game.addWatcher(UserId, socketUser)
					await this.PongService.updateStatusUser(UserId, UserStatus.WATCHING)
					this.server.to(socketUser.id).emit("spectate")
				}
			}
			else
				throw new BadRequestException()
		}
		catch(error: any){
			const socketUser =  AppService.connectedUsers.get(UserId.toString())
			if (socketUser)
				this.server.to(socketUser.id).emit("error", error.message)
		}
	}

		//@SubscribeMessage("stopSpectate")
			async handleStopSpectate(UserId: number, gameId : number)
			{
				try {
					if(!UserId || !gameId)
						throw new BadRequestException()
	
				// Verifie si le user auth est online
				const userStatus = await this.prisma.user.findUnique({
					where: {
						id: UserId
					},
					select: {
						status: true
					}
				})
				if (userStatus.status !== UserStatus.WATCHING)
					throw new ForbiddenException("You can't execute this action")
	
				let game: PongGame
				this.PongService.activeGames.forEach((element) => {
					if (element.id === gameId){
						game = element;
					}
				});	

				if (game)
				{
					await this.PongService.updateStatusUser(UserId, UserStatus.ONLINE)
					// const index = game.watcher.indexOf(client)
					// if(index != -1)
					// 	game.watcher.splice(index,1)
					game.removeWatcher(UserId)
				}
				else
					throw new BadRequestException()
				}
				catch (error) {
					if (error instanceof Prisma.PrismaClientKnownRequestError)
						throw new ForbiddenException("The provided user data is not allowed")
					else
						throw new BadRequestException()
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