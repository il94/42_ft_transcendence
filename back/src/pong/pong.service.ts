
export class PongService {

	public PongBounds: { height: number; width: number } = {height: 0, width: 0}

	public BallPos: {x:number; y:number } = {x: 0, y: 0}
	public BallDir: {x:number; y:number } = {x: 0, y: 0}
	public LeftPaddlePos: {x:number; y:number } = {x: 0, y: 0}
	public RightPaddlePos: {x:number; y:number } = {x: 0, y: 0}
	public Speed: number

}