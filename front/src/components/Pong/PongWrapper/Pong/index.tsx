import  {useState, useEffect, KeyboardEvent, useRef, useContext } from 'react'

import styled from 'styled-components'
import Paddle from './Paddle'
import Ball from './Ball'
import Score from './Score'
import InteractionContext from "../../../../contexts/InteractionContext"


const Style = styled.div`

position: absolute;

width: 95%;
/* height: 95%; */
aspect-ratio: 16/9;

max-width: 100%;
max-height: 100%;

background-color: black;

`;

export enum status {
	SOLO = "solo",
	WAITING = "waiting",
	ONGAME = "ongame"
}

function Pong({social}){
	
	const PongRef = useRef<HTMLDivElement | null>(null)
	const [PongBounds, setPongBounds] = useState<DOMRect | undefined>(PongRef.current?.getBoundingClientRect())
	const user = useContext(InteractionContext)!																	// !!!! object pour les sockets

	const [gameState, setGameState] = useState<status>(status.SOLO)											// neum moyen ilyes a mieux

	const [LeftPaddlePos, setLeftPaddlePos] = useState<{top: number, bottom: number}>({top: 0, bottom: 0}) //en px
	const [RightPaddlePos, setRightPaddlePos] = useState<{top: number, bottom: number}>({top: 0, bottom: 0})

	const [BallPos, setBallPos] = useState ({x: 0, y: 0});
	const [BallDir, setBallDir] = useState<{ x: number, y: number }>({ x: 0, y: 0 })

	const [score, setScore] = useState<{left: number, right: number}>({left: 0, right: 0})

	const [keysPressed, setKeysPressed] = useState<{ [key: string]: boolean }>({}); //tableau de key,    enfoncer = true; else false

	const PaddleSize: number = 10;
	const BallSize: number = 20;

	let currentBallPos = {
		x: 0,
		y: 0
	}
	
	const handleKeyDown = (event: KeyboardEvent) => {
		
		event.preventDefault();
		event.stopPropagation();
		
		setKeysPressed((prevKeys) => ({ ...prevKeys, [event.key]: true }));
	};
	
	const handleKeyUp = (event: KeyboardEvent) => {
		event.preventDefault();
		event.stopPropagation();
		
		setKeysPressed((prevKeys) => ({ ...prevKeys, [event.key]: false }));
	};
	
	const updatePositionOnKey = () => {
		const step = 1;
		let PongOne: number = 0; 
		
		if (PongBounds)
			PongOne = PongBounds.height / 100; //Pong 1% height in px
		
		if (keysPressed['Enter'])
		{
			setGameState(status.ONGAME)
			startGame()
			return;
		}
		if (PongBounds && (keysPressed['w'] || keysPressed['W'])) {
			if (LeftPaddlePos.top - PongOne * step >= 0)
			{
				setLeftPaddlePos({
					top: LeftPaddlePos.top - PongOne * step,
					bottom: LeftPaddlePos.bottom - PongOne * step
				});
			}
		}
		if (PongBounds && (keysPressed['s'] || keysPressed['S'])) {
			if (LeftPaddlePos.bottom + PongOne * step <= PongBounds.height)
			{
				setLeftPaddlePos({
					top: LeftPaddlePos.top + PongOne * step,
					bottom: LeftPaddlePos.bottom + PongOne * step
				});
			}
		}
		if (PongBounds && keysPressed['ArrowUp']) {
			if (RightPaddlePos.top - PongOne * step >= 0)
			{
				setRightPaddlePos({
					top: RightPaddlePos.top - PongOne * step,
					bottom: RightPaddlePos.bottom - PongOne * step
				});
			}
		}
		if (PongBounds && keysPressed['ArrowDown']) {
			if (RightPaddlePos.bottom + PongOne * step <= PongBounds.height)
			{
				setRightPaddlePos({
					top: RightPaddlePos.top + PongOne * step,
					bottom: RightPaddlePos.bottom + PongOne * step
				});
			}
		}
	};

	const startGame = () => {
		if (!PongBounds)
		return ;
		// if (keysPressed['Enter'])
		// 	setGameState()
		setBallPos({
			x: PongBounds.width / 2 - (BallSize/2),
			y: PongBounds.height / 2 - (BallSize/2)	
		});
		currentBallPos = {
			x: PongBounds.width / 2 - (BallSize/2),
			y: PongBounds.height / 2 - (BallSize/2)
		}
		setLeftPaddlePos({
			top: (45  * (PongBounds.height / 100)),
			bottom: (55 * (PongBounds.height / 100))
		});
		setRightPaddlePos({
			top: ((50 - (PaddleSize/2)) * (PongBounds.height / 100)),
			bottom: ((50 + (PaddleSize/2)) * (PongBounds.height / 100))
		});
		setScore({left: 0, right: 0})

	}

	// const resetBall = () => {
	// 	if (PongBounds)
	// 	{
	// 		setBallPos({
	// 			x: PongBounds.width / 2 - (BallSize/2),
	// 			y: PongBounds.height / 2 - (BallSize/2)
	// 		});
	// 		currentBallPos = {
	// 			x: PongBounds.width / 2 - (BallSize/2),
	// 			y: PongBounds.height / 2 - (BallSize/2)
	// 		}
	// 	}
	// }

	const LeftPaddleCollision = () => {

		let paddleX: number = 0;

		if (PongBounds)
		{
			paddleX = (PongBounds.width * 2.5 / 100); // 2.5 == paddle widh/2 + 2
			//paddleX = 27; // 2.5 == paddle widh/2 + 2
		}
		
		if (PongBounds && currentBallPos.x < paddleX)
		{
			if (PongBounds && ((currentBallPos.y + BallSize >= LeftPaddlePos.top  && currentBallPos.y + BallSize <= LeftPaddlePos.bottom) || (currentBallPos.y <= LeftPaddlePos.bottom && currentBallPos.y >= LeftPaddlePos.top)))
			{
			//	const BounceAngle = PaddleAngle()
			const PaddleSizePx: number = LeftPaddlePos.bottom - LeftPaddlePos.top 
			const CollisionOnPaddle: number = (LeftPaddlePos.top + PaddleSizePx/2) - (currentBallPos.y + (BallSize/2))
			const veloY: number = CollisionOnPaddle / (PaddleSizePx/2)
				console.log('----LEFT-----')
				console.log (BallDir)
				console.log ("pos of ball ",  (BallPos.y + BallDir.y + BallSize/2))
				console.log("top of the ball y : ", BallPos.y + BallDir.y)
				console.log("bottom of the ball y : ", BallPos.y + BallDir.y + BallSize)
				console.log("veloy ", veloY)
				console.log("top of the paddle y : ", LeftPaddlePos.top)
				console.log("bottom of the paddle y : ", LeftPaddlePos.bottom)
				console.log('---------')
				setBallDir({
					x: (-BallDir.x + 1),
					y: (-veloY * 4)
				})
				return true
			}
		}
		return false
	}

	const RightPaddleCollision = () => {
		let paddleX: number = 0;
		if (PongBounds)
		{
			paddleX = (PongBounds.width * 2.5 / 100); 	
			//paddleX = 27; // 2.5 == paddle widh/2 + 2
		}

		if (PongBounds && currentBallPos.x + BallSize > PongBounds.width - paddleX)
		{
			if (PongBounds && ((currentBallPos.y + BallSize >= RightPaddlePos.top  && currentBallPos.y + BallSize <= RightPaddlePos.bottom) || (currentBallPos.y <= RightPaddlePos.bottom && currentBallPos.y >= RightPaddlePos.top)))
			{
				//const BounceAngle = PaddleAngle()

			const PaddleSizePx: number = RightPaddlePos.bottom - RightPaddlePos.top 
			const CollisionOnPaddle: number = (RightPaddlePos.top + PaddleSizePx/2) - (currentBallPos.y + (BallSize/2))
			const veloY: number = CollisionOnPaddle / (PaddleSizePx/2)

				console.log("----RIGHT----")
				console.log (BallDir)
				console.log ("pos of ball ",  (BallPos.y + BallDir.y + BallSize/2))
				console.log("top of the ball y : ", BallPos.y + BallDir.y)
				console.log("bottom of the ball y : ", BallPos.y + BallDir.y + BallSize)
				console.log(" ", veloY)
				console.log("top of the paddle y : ", RightPaddlePos.top)
				console.log("bottom of the paddle y : ", RightPaddlePos.bottom)
				// console.log("collision on paddle", CollisionOnPaddle)
				// console.log("final angle ", BounceAngle)
				console.log("--------")
				setBallDir({
					x: (-BallDir.x - 1),
					y: (-veloY * 4)
				})
				return true
			}
		}
		return false
	}

	const PaddleCollision = () => {
		if (LeftPaddleCollision() || RightPaddleCollision())
			return true;
		return false
	}

	const checkCollision = () => {

		let paddleX: number = 0;

		if (PongBounds)
			paddleX = (PongBounds.width * 2.5 / 100); // espace horizontal entre le paddle est le bord du pong 

		if (PaddleCollision())
			return;

		if (PongBounds && (currentBallPos.x < paddleX || currentBallPos.x + BallSize > PongBounds.width - paddleX))
		{
			console.log('----SCORE-----')
			console.log("ball pos ", BallPos)
			console.log("current ball pos ", currentBallPos)
			console.log("Left paddle top y", LeftPaddlePos.top)
			console.log("Left paddle bottom y", LeftPaddlePos.bottom)
			console.log("right paddle top y", RightPaddlePos.top)
			console.log("right paddle bottom y", RightPaddlePos.bottom)
			console.log('---------')
			if (BallPos.x + BallDir.x < paddleX)
				setScore((prevScore) => ({left: prevScore.left, right: prevScore.right + 1}))
			else
				setScore((prevScore) => ({left: prevScore.left + 1, right: prevScore.right}))
			// resetBall()
		}
		if (PongBounds && (currentBallPos.y <= 0 || currentBallPos.y + BallSize >= PongBounds.height))
		{
			//if (!(BallPos.y - BallDir.y + (BallSize/2) < 0 || BallPos.y - BallDir.y + (BallSize/2) > PongBounds.height - BallSize))
			setBallDir((prevBallDir) => ({ x: prevBallDir.x, y: -prevBallDir.y }));
			console.log(BallDir)
		}
	}
	
	const updateBallPosition = () => {
		//console.log(BallDir)
		if (gameState == "ongame")
		{
			setBallPos((prevBallPos) => ({
				x: prevBallPos.x + BallDir.x,
				y: prevBallPos.y + BallDir.y,
			}));
			currentBallPos = {
				x: BallPos.x + BallDir.x,
				y: BallPos.y + BallDir.y,
			}
			checkCollision()
		}
	}
	
	const handleResetBallPos = (ballPos: any, ballDir: any) =>{
		
		// if (gameState == "ongame")
		setBallPos({
			x: ballPos.x,
			y: ballPos.y
		})
		currentBallPos = {
			x: ballPos.x,
			y: ballPos.y
		}	
		setBallDir({
			x: ballDir.x,
			y: ballDir.y	
		})
		// checkCollision()
	}

	useEffect(() => {
		const animationBallId = requestAnimationFrame(updateBallPosition);

		return () => {
				cancelAnimationFrame(animationBallId);
			}
	}, [BallPos]);
	
	useEffect(() => {
		// let phi: number; 
		// do {
		// 	phi = 2*Math.PI*Math.random();
		// } while ((phi >= Math.PI / 3 && phi <= 2 * Math.PI / 3) || (phi >= 4 * Math.PI / 3 && phi <= 5 * Math.PI / 3))
		// setBallDir({
		// 	x: (Math.cos(phi) * 5),
		// 	y: (Math.sin(phi) * 5)
		// })
		user.userAuthenticate.socket?.on("score", (id: any, args: any) => { console.log("in client from fct ", args, "id ", id)})
		user.userAuthenticate.socket?.on("resetBall", handleResetBallPos)
		//user.userAuthenticate.socket?.emit("moveBall")
		user.userAuthenticate.socket?.emit("resetBall")
		user.userAuthenticate.socket?.emit("score", score)

		return () => {
			user.userAuthenticate.socket?.off("score")
			user.userAuthenticate.socket?.off("resetBall")
		}
	}, [score])
	
	useEffect(() => {
		
		document.addEventListener('keydown', handleKeyDown, true);
		document.addEventListener('keyup', handleKeyUp, true);
		
		const animationPaddleId = requestAnimationFrame(updatePositionOnKey);
		
		return () => {
			document.removeEventListener('keydown', handleKeyDown, true);
			document.removeEventListener('keyup', handleKeyUp, true);
			cancelAnimationFrame(animationPaddleId);
		};
		
	}, [keysPressed, LeftPaddlePos, RightPaddlePos]);
	
	useEffect(() => {
		setPongBounds(PongRef.current?.getBoundingClientRect())

		user.userAuthenticate.socket?.on("PongBounds", (id: any, args: any) => { console.log("in client from PongBunds ", args, "id ", id)})
		user.userAuthenticate.socket?.emit("PongBounds", PongRef.current?.getBoundingClientRect())

		return () => {
			user.userAuthenticate.socket?.off("PongBounds")
		}
	}, [])

	useEffect(() => {
		// console.log("actu")
		// console.log("PongRef", PongRef.current?.getBoundingClientRect())
		setPongBounds(PongRef.current?.getBoundingClientRect())
		user.userAuthenticate.socket?.on("PongBounds", (id: any, args: any) => { console.log("in client from PongBunds ", args, "id ", id)})
		user.userAuthenticate.socket?.emit("PongBounds", PongRef.current?.getBoundingClientRect())

		return () => {
			user.userAuthenticate.socket?.off("PongBounds")
		}
	}, [PongRef.current?.parentElement, window.innerWidth, window.innerHeight, social])				
	
	return (
		<Style ref={PongRef}>
			{
				gameState == "ongame" && PongRef.current && gameState ? (
					<>
					<Paddle Hposition={2} Vposition={(LeftPaddlePos.bottom - (LeftPaddlePos.bottom - LeftPaddlePos.top) / 2)}/>
					<Ball X={BallPos.x} Y={BallPos.y} BallSize={BallSize}/>
					<Score LeftScore={score.left} RightScore={score.right}/>
					<Paddle Hposition={98} Vposition={(RightPaddlePos.bottom - (RightPaddlePos.bottom - RightPaddlePos.top) / 2)}/>
					{/* <Paddle Hposition={98} Vposition={VRightPaddle}/> */}
				</> ) :
				<div>PRESS ENTER TO PLAY</div>
			}
		</Style>
	);
}

export default Pong



