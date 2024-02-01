import {WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket} from "@nestjs/websockets";
import { subscribe } from "diagnostics_channel";
import { Server, Socket } from "socket.io";

import { PongService } from "./pong.service";
import { lstat } from "fs";

@WebSocketGateway()
export class PongGateway {
	
	@WebSocketServer()
	server: Server;
	
	handleConnection(client: Socket){
	}
	
	handleDeconnection(client: Socket){
	}
	
	public PongBounds: { height: number; width: number } = {height: 0, width: 0}

	private BallPos: {x:number; y:number }
	private BallDir: {x:number; y:number }
	private BallSize: number
	private LeftPaddlePos: {top:number; bottom:number }
	private RightPaddlePos: {top:number; bottom:number }
	private Speed: number
	private PaddleX: number

	constructor() {
		this.BallPos = {x: 0, y: 0}
		this.BallDir = {x: 0, y: 0}
		this.BallSize = 20;
		this.LeftPaddlePos = {top: 0, bottom: 0}	
		this.RightPaddlePos = {top: 0, bottom: 0}
		this.Speed = 0
		this.PaddleX = 0
	}
	
	@SubscribeMessage("PongBounds")
		handlePongBounds(client: Socket, data: any){
			console.log("PongBounds = ", data)
			this.PongBounds = {
				height: data.height,
				width: data.width
			}
			this.PaddleX = (this.PongBounds.width * 2.5 / 100)

			this.LeftPaddlePos = { top : 45 * (this.PongBounds.height/100) , bottom: 55 * (this.PongBounds.height/100)}
			this.RightPaddlePos = { top : 45 * (this.PongBounds.height/100) , bottom: 55 * (this.PongBounds.height/100)}
		}

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
			// args0 move
			// args1 paddle
			//args2 value
			if (args[1] == "left")
			{
				if (args[0] == "up")
				{
					this.LeftPaddlePos = {
						top: this.LeftPaddlePos.top - parseFloat(args[2]) , // 1% 
						bottom: this.LeftPaddlePos.bottom - parseFloat(args[2])
					}
				}
				if (args[0] == "down")
				{
					this.LeftPaddlePos = {
						top: this.LeftPaddlePos.top + parseFloat(args[2]) , // 1% 
						bottom: this.LeftPaddlePos.bottom + parseFloat(args[2])
					}
				}
				// this.server.to(client.id).emit("leftpaddlemove", this.LeftPaddlePos)            //// EMIT A L"ADVERSAIRE !!!!!!
			}
			else if (args[1] == "right")
			{
				if (args[0] == "up")
				{
					this.RightPaddlePos = {
						top: this.RightPaddlePos.top - parseFloat(args[2]) , // 1% 
						bottom: this.RightPaddlePos.bottom - parseFloat(args[2])
					}
				}
				if (args[0] == "down")
				{
					this.RightPaddlePos = {
						top: this.RightPaddlePos.top + parseFloat(args[2]) , // 1% 
						bottom: this.RightPaddlePos.bottom + parseFloat(args[2])
					}
				}
				// this.server.to(client.id).emit("rightpaddlemove", this.RightPaddlePos)         //// EMIT A L"ADVERSAIRE !!!!!!
			}
			console.log("new paddle pos ", this.LeftPaddlePos, this.RightPaddlePos)
		}

	@SubscribeMessage("resetBall")
		resetBall(client: Socket){
			this.BallPos = {
				x: this.PongBounds.width / 2,
				y: this.PongBounds.height / 2
			}
			let phi: number; 
			do {
				phi = 2*Math.PI*Math.random();
			} while ((phi >= Math.PI / 3 && phi <= 2 * Math.PI / 3) || (phi >= 4 * Math.PI / 3 && phi <= 5 * Math.PI / 3))
			this.BallDir = {
				x: Math.cos(phi) * 5,
				y: Math.sin(phi) * 5
			}
			
			console.log("reset game init : ", this.BallPos, this.BallDir)
			this.server.to(client.id).emit("resetBall", this.BallPos, this.BallDir)
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