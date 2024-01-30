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

	private BallPos: {x:number; y:number } = {x: 0, y: 0}
	private BallDir: {x:number; y:number } = {x: 0, y: 0}
	private BallSize: number = 20;
	private LeftPaddlePos: {top:number; bottom:number } = {top: 0, bottom: 0}
	private RightPaddlePos: {top:number; bottom:number } = {top: 0, bottom: 0}
	private Speed: number = 0
	private PaddleX: number = 0

	@SubscribeMessage("PongBounds")
		handlePongBounds(client: Socket, data: any){
			console.log("PongBounds = ", data)
			this.PongBounds = {
				height: data.height,
				width: data.width
			}
			this.PaddleX = (this.PongBounds.width * 2.5 / 100)
		}

	@SubscribeMessage("score")
	// handleScore(@MessageBody() data: string, @ConnectedSocket() client: Socket, args: any){
		handleScore(client: Socket, data: any){
			const clientID = client.id;
			
			//console.log("emit back", data)
			this.server.to(client.id).emit('score', client.id, data)
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
		handlePaddleMove(client: Socket, move: string)
		{
			if (move === "up")
			{
				this.LeftPaddlePos = {
					top: this.LeftPaddlePos.top - (this.PongBounds.height / 100) , // 1% 
					bottom: this.LeftPaddlePos.bottom - (this.PongBounds.height / 100)
				}
			}
			else if (move === "down")
			{
				this.LeftPaddlePos = {
					top: this.LeftPaddlePos.top + (this.PongBounds.height / 100) , // 1% 
					bottom: this.LeftPaddlePos.bottom + (this.PongBounds.height / 100)
				}
			}
			this.server.to(client.id).emit("paddlemove", this.LeftPaddlePos)
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