import {Socket} from 'socket.io'
import { Injectable } from '@nestjs/common';

@Injectable()
export class Player {

	private socket: Socket;

	private Pos: {top: number, bottom: number}
	private score: number

	constructor(socket: Socket)
	{
		this.socket = socket;
		console.log("cc from player socket.id :", this.socket.id)
		this.Pos = {top : 486, bottom: 594} // middle 540 == 50% de 1080
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
		if (this.Pos.top - 1080/100 > 0)
		{
			this.Pos.top -= 1080/100
			this.Pos.bottom -= 1080/100
		}
	}

	moveDown(){
		if (this.Pos.bottom + 1080/100 < 1080)
		{
			this.Pos.top += 1080/100
			this.Pos.bottom += 1080/100
		}
	}

	getPos(){
		return this.Pos
	}

	getScore(){
		return this.score
	}

	addScore(){
		this.score++
	}

	getSocket() : Socket{
		return this.socket;
	}
}

@Injectable()
export class Ball {

	private Pos: {x: number, y: number}
	private Dir: {x: number, y: number}
	public speed: number

	constructor(s: number){
		this.resetPos() 
		this.setRandomDir()
		this.speed = s
	}

	getPos(){
		return this.Pos
	}

	setPos(newX: number, newY: number){
		this.Pos.x = newX
		this.Pos.y = newY
	}

	getDir(){
		return this.Dir
	}

	setDir(newX: number, newY: number){
		this.Dir = {
			x: newX,
			y: newY
		}
	}

	setRandomDir(){
		let phi: number; 
			do {
				phi = 2*Math.PI*Math.random();
			} while ((phi >= Math.PI / 3 && phi <= 2 * Math.PI / 3) || (phi >= 4 * Math.PI / 3 && phi <= 5 * Math.PI / 3))
		this.Dir = {
			x: Math.cos(phi) * 5,
			y: Math.sin(phi) * 5
		}
	}

	move(){
		this.Pos = {
			x: this.Pos.x + this.Dir.x,
			y: this.Pos.y + this.Dir.y
		}
	}

	resetPos(){
		this.Pos = {
			x: 960,
			y: 540
		}
	}

	//checkPadlleCollision(){}
}

@Injectable()
export class PongGame {

	// public PongBounds: { height: number; width: number } = {height: 0, width: 0}
	// private PaddleX: number

	private Players: Socket[]

	private state: boolean

	height: number;
	width: number;

	public	Ball: Ball
	public 	BallSize: number
	
	private Speed: number   // degager quand niveau de dificuliter ajouter (sera juste dans le constructor pour la ball)
	
	public LeftPlayer: Player
	public RightPlayer: Player
	public paddleMargin: number
	// private LeftPaddlePos: {top:number; bottom:number }
	// private RightPaddlePos: {top:number; bottom:number }

	constructor(host: Socket, guest: Socket) {
	// constructor() {
		// this.BallPos = {x: 0, y: 0}
		// this.BallDir = {x: 0, y: 0}

		this.state = true

		this.LeftPlayer = new Player(host)
		this.RightPlayer = new Player(guest)
		this.Players = [host, guest]
		this.Speed = 7
		this.Ball = new Ball(this.Speed)

		this.width = 1920
		this.height = 1080

		this.BallSize = 25
		this.paddleMargin = 2.5 * 1920 / 100 // 2.5%
	}


	checkPaddleCollision(){

		const ball = this.Ball.getPos()
		const balldir = this.Ball.getDir()

		//gauche == ballpos - ballsize/2 
		//droite == ballpos + ballsize/2 

		//si le bas bas de la balle touche le haut du paddle
		//si le haut de la balle touche le bas du paddle
		//si le milieu touche le
		
		if (ball.x + balldir.x - (this.BallSize/2) < this.paddleMargin) // rebond paddle gauche
		{
			// if (ball.x != this.paddleMargin)
			// 	this.Ball.setPos(this.paddleMargin, ball.y)
			if((ball.y + (this.BallSize/2) >= this.LeftPlayer.getPos().top && ball.y + (this.BallSize/2) <= this.LeftPlayer.getPos().bottom) || (ball.y - (this.BallSize/2) <= this.LeftPlayer.getPos().bottom && ball.y - (this.BallSize/2) >= this.LeftPlayer.getPos().top))
			{

				const PaddleSizePx: number = this.LeftPlayer.getPos().bottom - this.LeftPlayer.getPos().top 
				const CollisionOnPaddle: number = (this.LeftPlayer.getPos().top + PaddleSizePx/2) - (this.Ball.getPos().y)
				const veloY: number = CollisionOnPaddle / (PaddleSizePx/2)

				this.Ball.setDir(balldir.x * -1 + 1, -veloY * 10)

				console.log("col on paddle", CollisionOnPaddle)
				console.log("left paddle pos", this.LeftPlayer.getPos())
				console.log("ball pos", this.Ball.getPos())
			}
		}

		if (ball.x + balldir.x + (this.BallSize/2) > 1920 - this.paddleMargin)
		{
		// 	if (ball.x != 1920 - this.paddleMargin)
		// 	this.Ball.setPos(1920 - this.paddleMargin, ball.y)
			if((ball.y + (this.BallSize/2) >= this.RightPlayer.getPos().top && ball.y + (this.BallSize/2) <= this.RightPlayer.getPos().bottom) || (ball.y - (this.BallSize/2) <= this.RightPlayer.getPos().bottom && ball.y - (this.BallSize/2) >= this.RightPlayer.getPos().top))
			{


				const PaddleSizePx: number = this.RightPlayer.getPos().bottom - this.RightPlayer.getPos().top 
				const CollisionOnPaddle: number = (this.RightPlayer.getPos().top + PaddleSizePx/2) - (this.Ball.getPos().y)
				const veloY: number = CollisionOnPaddle / (PaddleSizePx/2)

				this.Ball.setDir(balldir.x * -1 -1, -veloY * 10)

				console.log("col on paddle", CollisionOnPaddle)
				console.log("left paddle pos", this.RightPlayer.getPos())
				console.log("ball pos", this.Ball.getPos())
			}
		}
	}
	
	checkWallCollision(){

		const ball = this.Ball.getPos()
		const balldir = this.Ball.getDir()
		
		if (ball.y + balldir.y - (this.BallSize/2) < 0 || ball.y + balldir.y + (this.BallSize/2) > 1080)
			this.Ball.setDir(balldir.x, -balldir.y)

		if (ball.x + balldir.x - (this.BallSize/2) < this.paddleMargin)
		{
			this.Ball.resetPos()
			this.Ball.setRandomDir()
			this.RightPlayer.addScore()
		}
		if (ball.x + balldir.x + (this.BallSize/2) > 1920 - this.paddleMargin)
		{
			this.Ball.resetPos()
			this.Ball.setRandomDir()
			this.LeftPlayer.addScore()
		}
	}

	checkScore(){
		if (this.LeftPlayer.getScore() === 11 || this.RightPlayer.getScore() === 11)
			this.setState(false)
	}

	getTheWinner(){ // victory
		if (this.LeftPlayer.getScore() === 11)
			return this.LeftPlayer
		if (this.RightPlayer.getScore() === 11)
			return this.RightPlayer
		return null
	}

	moveBall(){

		this.checkPaddleCollision()
		this.checkWallCollision()
		this.Ball.move()
	}

	setState(s: boolean){
		this.state = s
	}

	getState(){
		return this.state
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