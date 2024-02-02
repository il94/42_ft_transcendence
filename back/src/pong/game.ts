import {Socket} from 'socket.io'
import { Injectable } from '@nestjs/common';

export class Player {

	private socket: Socket;
	
	public paddlePos: {top: number, bottom: number}
	public score: number

	contructor(socket: Socket)
	// contructor()
	{
		this.socket = socket;
		this.paddlePos = {top : 50, bottom: 50} // always poungbounds nique this shit
		this.score = 0 // always poungbounds nique this shit
	}

	// setPaddlePos(newtop: number, newbottom: number){
	// 	this.paddlePos = {
	// 		top: newtop,
	// 		bottom: newbottom
	// 	}
	// }

	// setScore(newscore: number){
	// 	this.score = newscore;
	// }

	// getSocket() : Socket{
	// 	return this.socket;
	// }

}

export class Ball {

	public ballPos: {x: number, y: number}
	public ballDir: {x: number, y: number}

	constructor(){
		this.ballPos = {x: 0, y: 0} 
		this.ballDir = {x: 0, y: 0} 
	}


	//checkPadlleCollision(){}
}

@Injectable()
export class PongGame {

	public PongBounds: { height: number; width: number } = {height: 0, width: 0}
	private PaddleX: number
	private Players: Socket[]

	// private BallPos: {x:number; y:number }
	// private BallDir: {x:number; y:number }
	private BallSize: number
	public	Ball: Ball
	
	private Speed: number
	
	public LeftPlayer: Player
	public RightPlayer: Player
	// private LeftPaddlePos: {top:number; bottom:number }
	// private RightPaddlePos: {top:number; bottom:number }

	constructor(host: Socket, guest: Socket) {
	// constructor() {
		// this.BallPos = {x: 0, y: 0}
		// this.BallDir = {x: 0, y: 0}
		this.BallSize = 20;
		this.Ball = new Ball

		// this.Players = [host, guest]
		this.LeftPlayer = new Player(host)
		this.RightPlayer = new Player(guest)

		// this.LeftPaddlePos = {top: 0, bottom: 0}	
		// this.RightPaddlePos = {top: 0, bottom: 0}
		this.Speed = 0
		this.PaddleX = 0
	}

}