import {Socket} from 'socket.io'
import { Injectable } from '@nestjs/common';

@Injectable()
export class Player {

	private socket: Socket;
	public id: number;
	public name: string;
	public winner: boolean;

	private Pos: {top: number, bottom: number}
	private score: number

	constructor(socket: Socket, Id:number, name: string)
	{
		this.socket = socket;
		this.id = Id;
		this.name = name;
		this.winner = false;
		this.Pos = {top : 486, bottom: 594} // middle 540 == 50% de 1080
		this.score = 0
	}


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

	setWinner(){
		this.winner = true
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
}

@Injectable()
export class PongGame {

	private Players: Socket[]
	public watcher: Socket[]
	public	id: number
	public difficulty: number
	public messageId? : number

	private state: boolean

	height: number;
	width: number;

	public	Ball: Ball
	public 	BallSize: number	
	private Speed: number   // degager quand niveau de dificuliter ajouter (sera juste dans le constructor pour la ball)
	
	public LeftPlayer: Player
	public RightPlayer: Player
	public paddleMargin: number


	constructor(Id: number, dif: number, host: Socket, hostId:number, hostName:string, guest: Socket, guestId: number, guestName: string, messageId? : number) {

		this.id = Id;
		this.difficulty = dif
		this.state = true
		this.LeftPlayer = new Player(host, hostId, hostName)
		this.RightPlayer = new Player(guest, guestId, guestName)
		this.Players = [host, guest]
		this.watcher = []
		this.Speed = 7
		this.Ball = new Ball(this.Speed)
		if (messageId)
			this.messageId = messageId

		this.width = 1920
		this.height = 1080

		this.BallSize = 25
		this.paddleMargin = 2.5 * 1920 / 100 // 2.5%
	}


	checkPaddleCollision(){

		const ball = this.Ball.getPos()
		const balldir = this.Ball.getDir()
	
		if (ball.x + balldir.x - (this.BallSize/2) < this.paddleMargin) // rebond paddle gauche
		{
			if((ball.y + (this.BallSize/2) >= this.LeftPlayer.getPos().top && ball.y + (this.BallSize/2) <= this.LeftPlayer.getPos().bottom) || (ball.y - (this.BallSize/2) <= this.LeftPlayer.getPos().bottom && ball.y - (this.BallSize/2) >= this.LeftPlayer.getPos().top))
			{

				const PaddleSizePx: number = this.LeftPlayer.getPos().bottom - this.LeftPlayer.getPos().top 
				const CollisionOnPaddle: number = (this.LeftPlayer.getPos().top + PaddleSizePx/2) - (this.Ball.getPos().y)
				const veloY: number = CollisionOnPaddle / (PaddleSizePx/2)

				this.Ball.setDir(balldir.x * -1 + 1, -veloY * 10)

				// console.log("col on paddle", CollisionOnPaddle)
				// console.log("left paddle pos", this.LeftPlayer.getPos())
				// console.log("ball pos", this.Ball.getPos())
			}
		}

		if (ball.x + balldir.x + (this.BallSize/2) > 1920 - this.paddleMargin)
		{
			if((ball.y + (this.BallSize/2) >= this.RightPlayer.getPos().top && ball.y + (this.BallSize/2) <= this.RightPlayer.getPos().bottom) || (ball.y - (this.BallSize/2) <= this.RightPlayer.getPos().bottom && ball.y - (this.BallSize/2) >= this.RightPlayer.getPos().top))
			{


				const PaddleSizePx: number = this.RightPlayer.getPos().bottom - this.RightPlayer.getPos().top 
				const CollisionOnPaddle: number = (this.RightPlayer.getPos().top + PaddleSizePx/2) - (this.Ball.getPos().y)
				const veloY: number = CollisionOnPaddle / (PaddleSizePx/2)

				this.Ball.setDir(balldir.x * -1 -1, -veloY * 10)

				// console.log("col on paddle", CollisionOnPaddle)
				// console.log("left paddle pos", this.RightPlayer.getPos())
				// console.log("ball pos", this.Ball.getPos())
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

	SetTheWinner(){ // victory
		if (this.LeftPlayer.getScore() === 11)
			this.LeftPlayer.setWinner()
		if (this.RightPlayer.getScore() === 11)
			this.RightPlayer.setWinner()
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

	isMyPlayerById(n: number){
		if(this.LeftPlayer.id === n)
			return true
		else if (this.RightPlayer.id === n)
			return true
		return false
	}

	addWatcher(s: Socket)
	{
		console.log("addWatcher")
		if (!s)
			console.log("in addWatcher client socket is empty")
		else
			this.watcher.push(s)
	}

	removeWatcher(s: Socket)
	{
		const index = this.watcher.indexOf(s)
		if (index != -1)
			this.watcher.splice(index, 1)
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