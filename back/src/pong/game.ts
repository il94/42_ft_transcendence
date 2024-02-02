import {Socket} from 'socket.io'
import { Injectable } from '@nestjs/common';

@Injectable()
export class Player {

	private socket: Socket;
	
	private paddlePos: {top: number, bottom: number}
	public score: number

	constructor(socket: Socket)
	{
		this.socket = socket;
		console.log("cc from player socket.id :", this.socket.id)
		this.paddlePos = {top : 486, bottom: 594} // middle 540 == 50% de 1080
		this.score = 0 
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

	moveUp(){
		if (this.paddlePos.top - 1080/100 > 0)
		{
			this.paddlePos.top -= 1080/100
			this.paddlePos.bottom -= 1080/100
		}
	}

	moveDown(){
		if (this.paddlePos.bottom + 1080/100 < 1080)
		{
			this.paddlePos.top += 1080/100
			this.paddlePos.bottom += 1080/100
		}
	}

	getPaddlePos(){
		return this.paddlePos
	}

	getSocket() : Socket{
		return this.socket;
	}

}

@Injectable()
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

	// public PongBounds: { height: number; width: number } = {height: 0, width: 0}
	// private PaddleX: number

	private Players: Socket[]

	height: number;
	width: number;

	public	Ball: Ball
	private BallSize: number
	
	private Speed: number
	
	public LeftPlayer: Player
	public RightPlayer: Player
	// private LeftPaddlePos: {top:number; bottom:number }
	// private RightPaddlePos: {top:number; bottom:number }

	constructor(host: Socket, guest: Socket) {
	// constructor() {
		// this.BallPos = {x: 0, y: 0}
		// this.BallDir = {x: 0, y: 0}
		this.LeftPlayer = new Player(host)
		this.RightPlayer = new Player(guest)
		this.Players = [host, guest]
		this.Ball = new Ball

		this.width = 1920;
		this.height = 1080;
		this.BallSize = 20;
		this.Speed = 1

	}

	isMyPlayer(socket: Socket){
		if(this.LeftPlayer.getSocket() === socket)
			return true
		else if (this.RightPlayer.getSocket() === socket)
			return true
		return false
	}

	isMyHost(socket: Socket){
		if (this.LeftPlayer.getSocket() === socket)
			return true
	}

	getHost(){
		return this.Players[0]
	}

	getGuest(){
		return this.Players[1]
	}

}