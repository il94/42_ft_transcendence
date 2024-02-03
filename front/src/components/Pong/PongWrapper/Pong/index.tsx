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

// export enum status {
// 	SOLO = "solo",
// 	WAITING = "waiting",
// 	ONGAME = "ongame"
// }

type PongProps = {
	social: any;
	enemyId: number;
}

function Pong({social, enemyId}: PongProps){
	
	const user = useContext(InteractionContext)!																// !!!! object pour les sockets

	const PongRef = useRef<HTMLDivElement | null>(null)
	const [PongBounds, setPongBounds] = useState<DOMRect | undefined>(undefined)
	

	// const [gameState, setGameState] = useState<status>(status.SOLO)											// neum moyen ilyes a mieux

	const [PaddlePos, setPaddlePos] = useState<{top: number, bottom: number}>({top: 0, bottom: 0}) //en px
	const [EnemyPaddlePos, setEnemyPaddlePos] = useState<{top: number, bottom: number}>({top: 0, bottom: 0})
	
	const [ballSize, setBallSize] = useState(20);

	const [BallPos, setBallPos] = useState ({x: 0, y: 0});

	const [score, setScore] = useState<{left: number, right: number}>({left: 0, right: 0})

	const [keysPressed, setKeysPressed] = useState<{ [key: string]: boolean }>({}); //tableau de key,    enfoncer = true; else false

	
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
	
		let ConvertionFactor: number = 0;
		let move: number = 0;
		
		if (!PongRef.current?.getBoundingClientRect())
			return

		ConvertionFactor = PongRef.current.getBoundingClientRect().height / 1080; // 1080 = base of pong in back
		move = 10.8 * ConvertionFactor
		
		if (keysPressed['ArrowUp']) {
			if (PaddlePos.top - move >= 0)
			{
				setPaddlePos({
					top: PaddlePos.top - move,
					bottom: PaddlePos.bottom - move
				});
				user.userAuthenticate.socket?.emit("paddlemove", "up")
			}
		}
		if (keysPressed['ArrowDown']) {
			if (PaddlePos.bottom + move <= PongRef.current.getBoundingClientRect().height)
			{
				setPaddlePos({
					top: PaddlePos.top + move,
					bottom: PaddlePos.bottom + move
				});
				user.userAuthenticate.socket?.emit("paddlemove", "down")
			}
		}
	};

	const handleEnemyMove = (arg: string) => {
		
		let ConvertionFactor: number = 0; 
		let move: number = 0;

		if (!PongRef.current?.getBoundingClientRect())
			return

		//console.log("je recois le deplacement de mon enemi")

		ConvertionFactor = PongRef.current.getBoundingClientRect().height / 1080; // 1080 = base of pong in back
		move = 10.8 * ConvertionFactor
		
		if (arg === "up")
		{
			setEnemyPaddlePos({
				top: EnemyPaddlePos.top - move,
				bottom: EnemyPaddlePos.bottom - move
			});
		}
		else
		{
			setEnemyPaddlePos({
				top: EnemyPaddlePos.top + move,
				bottom: EnemyPaddlePos.bottom + move
			});
		}

	}
	//maybe backPaddlePos.top/bottom * convertionFactor better

	const reRender = (me: any, enemy: any) => {

		if (!PongRef.current?.getBoundingClientRect())
		return ;
		let ConvertionFactor = PongRef.current?.getBoundingClientRect().height / 1080;

		setPaddlePos({
			top: me.top * ConvertionFactor,
			bottom: me.bottom * ConvertionFactor
		})
		setEnemyPaddlePos({
			top: enemy.top * ConvertionFactor,
			bottom: enemy.bottom * ConvertionFactor
		})

	}

	const startGame = () => {

		if (!PongRef.current?.getBoundingClientRect())
		return ;
		
		let ConvertionFactor = PongRef.current?.getBoundingClientRect().height / 1080;

		// console.log("facteur de converstion : ", ConvertionFactor)
		let top = 486 * ConvertionFactor
		let bottom = 594 * ConvertionFactor //size of back
		// let ballX = 960 * ConvertionFactor 
		// let ballY = 540 * ConvertionFactor 
		user.userAuthenticate.socket?.emit("getBallInfo")
		setPaddlePos({
			top: (top),
			bottom: (bottom)
		});
		setEnemyPaddlePos({
			top: (top),
			bottom: (bottom)
		});
		setScore({left: 0, right: 0})
	}

	const updateBall = (ballPosition: any, myScore: number, enemyScore: number) => {
		
		if (!PongRef.current?.getBoundingClientRect())
		return ;
		
		let ConvertionFactor = PongRef.current?.getBoundingClientRect().height / 1080;

		console.log("je rentre dans la function updateBall")
		setBallPos({
			x: ballPosition.x * ConvertionFactor,
			y: ballPosition.y * ConvertionFactor
		})
		setBallSize(25 * ConvertionFactor)
		setScore({left: myScore, right: enemyScore})
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

	// const LeftPaddleCollision = () => {

	// 	let paddleX: number = 0;

	// 	if (PongBounds)
	// 	{
	// 		paddleX = (PongBounds.width * 2.5 / 100); // 2.5 == paddle widh/2 + 2
	// 		//paddleX = 27; // 2.5 == paddle widh/2 + 2
	// 	}
		
	// 	if (PongBounds && currentBallPos.x < paddleX)
	// 	{
	// 		if (PongBounds && ((currentBallPos.y + BallSize >= LeftPaddlePos.top  && currentBallPos.y + BallSize <= LeftPaddlePos.bottom) || (currentBallPos.y <= LeftPaddlePos.bottom && currentBallPos.y >= LeftPaddlePos.top)))
	// 		{
	// 		//	const BounceAngle = PaddleAngle()
	// 		const PaddleSizePx: number = LeftPaddlePos.bottom - LeftPaddlePos.top 
	// 		const CollisionOnPaddle: number = (LeftPaddlePos.top + PaddleSizePx/2) - (currentBallPos.y + (BallSize/2))
	// 		const veloY: number = CollisionOnPaddle / (PaddleSizePx/2)
	// 			// console.log('----LEFT-----')
	// 			// console.log (BallDir)
	// 			// console.log ("pos of ball ",  (BallPos.y + BallDir.y + BallSize/2))
	// 			// console.log("top of the ball y : ", BallPos.y + BallDir.y)
	// 			// console.log("bottom of the ball y : ", BallPos.y + BallDir.y + BallSize)
	// 			// console.log("veloy ", veloY)
	// 			// console.log("top of the paddle y : ", LeftPaddlePos.top)
	// 			// console.log("bottom of the paddle y : ", LeftPaddlePos.bottom)
	// 			// console.log('---------')
	// 			setBallDir({
	// 				x: (-BallDir.x + 1),
	// 				y: (-veloY * 4)
	// 			})
	// 			return true
	// 		}
	// 	}
	// 	return false
	// }

	// const RightPaddleCollision = () => {
	// 	let paddleX: number = 0;
	// 	if (PongBounds)
	// 	{
	// 		paddleX = (PongBounds.width * 2.5 / 100); 	
	// 		//paddleX = 27; // 2.5 == paddle widh/2 + 2
	// 	}

	// 	if (PongBounds && currentBallPos.x + BallSize > PongBounds.width - paddleX)
	// 	{
	// 		if (PongBounds && ((currentBallPos.y + BallSize >= RightPaddlePos.top  && currentBallPos.y + BallSize <= RightPaddlePos.bottom) || (currentBallPos.y <= RightPaddlePos.bottom && currentBallPos.y >= RightPaddlePos.top)))
	// 		{
	// 			//const BounceAngle = PaddleAngle()

	// 		const PaddleSizePx: number = RightPaddlePos.bottom - RightPaddlePos.top 
	// 		const CollisionOnPaddle: number = (RightPaddlePos.top + PaddleSizePx/2) - (currentBallPos.y + (BallSize/2))
	// 		const veloY: number = CollisionOnPaddle / (PaddleSizePx/2)

	// 			// console.log("----RIGHT----")
	// 			// console.log (BallDir)
	// 			// console.log ("pos of ball ",  (BallPos.y + BallDir.y + BallSize/2))
	// 			// console.log("top of the ball y : ", BallPos.y + BallDir.y)
	// 			// console.log("bottom of the ball y : ", BallPos.y + BallDir.y + BallSize)
	// 			// console.log(" ", veloY)
	// 			// console.log("top of the paddle y : ", RightPaddlePos.top)
	// 			// console.log("bottom of the paddle y : ", RightPaddlePos.bottom)
	// 			// // console.log("collision on paddle", CollisionOnPaddle)
	// 			// // console.log("final angle ", BounceAngle)
	// 			// console.log("--------")
	// 			setBallDir({
	// 				x: (-BallDir.x - 1),
	// 				y: (-veloY * 4)
	// 			})
	// 			return true
	// 		}
	// 	}
	// 	return false
	// }

	// const PaddleCollision = () => {
	// 	if (LeftPaddleCollision() || RightPaddleCollision())
	// 		return true;
	// 	return false
	// }

	// const checkCollision = () => {

	// 	let paddleX: number = 0;

	// 	if (PongBounds)
	// 		paddleX = (PongBounds.width * 2.5 / 100); // espace horizontal entre le paddle est le bord du pong 

	// 	if (PaddleCollision())
	// 		return;

	// 	if (PongBounds && (currentBallPos.x < paddleX || currentBallPos.x + BallSize > PongBounds.width - paddleX))
	// 	{
	// 		// console.log('----SCORE-----')
	// 		// console.log("ball pos ", BallPos)
	// 		// console.log("current ball pos ", currentBallPos)
	// 		// console.log("Left paddle top y", PaddlePos.top)
	// 		// console.log("Left paddle bottom y", PaddlePos.bottom)
	// 		// console.log("right paddle top y", PaddlePos.top)
	// 		// console.log("right paddle bottom y", PaddlePos.bottom)
	// 		// console.log('---------')
	// 		if (BallPos.x + BallDir.x < paddleX)
	// 			setScore((prevScore) => ({left: prevScore.left, right: prevScore.right + 1}))
	// 		else
	// 			setScore((prevScore) => ({left: prevScore.left + 1, right: prevScore.right}))
	// 		// resetBall()
	// 	}
	// 	if (PongBounds && (currentBallPos.y <= 0 || currentBallPos.y + BallSize >= PongBounds.height))
	// 	{
	// 		//if (!(BallPos.y - BallDir.y + (BallSize/2) < 0 || BallPos.y - BallDir.y + (BallSize/2) > PongBounds.height - BallSize))
	// 		setBallDir((prevBallDir) => ({ x: prevBallDir.x, y: -prevBallDir.y }));
	// 		console.log(BallDir)
	// 	}
	// }
	
	// const updateBallPosition = () => {
	// 	//console.log(BallDir)
	// 	if (gameState == "ongame")
	// 	{
	// 		setBallPos((prevBallPos) => ({
	// 			x: prevBallPos.x + BallDir.x,
	// 			y: prevBallPos.y + BallDir.y,
	// 		}));
	// 		currentBallPos = {
	// 			x: BallPos.x + BallDir.x,
	// 			y: BallPos.y + BallDir.y,
	// 		}
	// 		checkCollision()
	// 	}
	// }
	
	// const handleResetBallPos = (ballPos: any, ballDir: any) =>{
		
	// 	// if (gameState == "ongame")
	// 	setBallPos({
	// 		x: ballPos.x,
	// 		y: ballPos.y
	// 	})
	// 	currentBallPos = {
	// 		x: ballPos.x,
	// 		y: ballPos.y
	// 	}	
	// 	setBallDir({
	// 		x: ballDir.x,
	// 		y: ballDir.y	
	// 	})
	// 	// checkCollision()
	// }

	// useEffect(() => {
	// 	const animationBallId = requestAnimationFrame(updateBallPosition);

	// 	return () => {
	// 			cancelAnimationFrame(animationBallId);
	// 		}
	// }, [BallPos]);
	
	useEffect(() => {
		// let phi: number; 
		// do {
		// 	phi = 2*Math.PI*Math.random();
		// } while ((phi >= Math.PI / 3 && phi <= 2 * Math.PI / 3) || (phi >= 4 * Math.PI / 3 && phi <= 5 * Math.PI / 3))
		// setBallDir({
		// 	x: (Math.cos(phi) * 5),
		// 	y: (Math.sin(phi) * 5)
		// })
		// user.userAuthenticate.socket?.on("resetBall", handleResetBallPos)
		// user.userAuthenticate.socket?.on("score", (id: any, args: any) => { console.log("in client from fct ", args, "id ", id)})
		// //user.userAuthenticate.socket?.emit("moveBall")
		// user.userAuthenticate.socket?.emit("resetBall")
		// user.userAuthenticate.socket?.emit("score", score)
		
		return () => {
			// user.userAuthenticate.socket?.off("score")
			// user.userAuthenticate.socket?.off("resetBall")
		}
	}, [score])
	
	useEffect(() => {
		user.userAuthenticate.socket?.on("ballInfo", updateBall)

		return () => {
			user.userAuthenticate.socket?.off("ballInfo")
		}
	}, [BallPos])

	useEffect(() => {
		
		document.addEventListener('keydown', handleKeyDown, true);
		document.addEventListener('keyup', handleKeyUp, true);
		
		const animationPaddleId = requestAnimationFrame(updatePositionOnKey);
		
		return () => {
			document.removeEventListener('keydown', handleKeyDown, true);
			document.removeEventListener('keyup', handleKeyUp, true);
			cancelAnimationFrame(animationPaddleId);
		};
		
	}, [keysPressed, PaddlePos]);
	
	useEffect(() => {
		user.userAuthenticate.socket?.on("enemyMove", handleEnemyMove)

		return () => {
			user.userAuthenticate.socket?.off("enemyMove")
		}
	}, [EnemyPaddlePos])

	useEffect(() => {
		
		if(PongRef.current)
			setPongBounds(PongRef.current?.getBoundingClientRect())

		user.userAuthenticate.socket?.on("ballInfo", updateBall)
		startGame()
		// user.userAuthenticate.socket?.on("PongBounds", (id: any, args: any) => { console.log("in client from PongBounds ", args, "id ", id)})
		// user.userAuthenticate.socket?.on("launchgame", startGame)


		// user.userAuthenticate.socket?.on("leftpaddlemove", handlepaddlemove)
		// user.userAuthenticate.socket?.emit("PongBounds", PongRef.current?.getBoundingClientRect())
		// user.userAuthenticate.socket?.emit("paddlemove", "down", "left", )
		
		// return () => {
		// 	user.userAuthenticate.socket?.off("PongBounds")
		// 	user.userAuthenticate.socket?.off("leftpaddlemove")start
		// }
		// user.userAuthenticate.socket?.on("enemyMove", handleEnemyMove)

		return () => {
			user.userAuthenticate.socket?.off("ballInfo")
		}
	}, [])

	useEffect(() => {
		// console.log("actu")
		// console.log("PongRef", PongRef.current?.getBoundingClientRect())
		setPongBounds(PongRef.current?.getBoundingClientRect())
		user.userAuthenticate.socket?.on("receivePos", reRender)
		user.userAuthenticate.socket?.emit("reRender")
		// user.userAuthenticate.socket?.on("PongBounds", (id: any, args: any) => { console.log("in client from PongBunds ", args, "id ", id)})
		// user.userAuthenticate.socket?.emit("PongBounds", PongRef.current?.getBoundingClientRect())
		return () => {
			user.userAuthenticate.socket?.off("receivePos")
			// user.userAuthenticate.socket?.off("PongBounds")
		}
	}, [PongRef.current?.parentElement, window.innerWidth, window.innerHeight, social])				
	
	return (
		<Style ref={PongRef}>
			{
				// gameState == "ongame" && PongRef.current ? (
					PongRef.current ? (
					<>
					<Paddle Hposition={2} Vposition={(PaddlePos.bottom - (PaddlePos.bottom - PaddlePos.top) / 2)}/>
					<Ball X={BallPos.x} Y={BallPos.y} BallSize={ballSize}/>
					<Score LeftScore={score.left} RightScore={score.right}/>
					<Paddle Hposition={98} Vposition={(EnemyPaddlePos.bottom - (EnemyPaddlePos.bottom - EnemyPaddlePos.top) / 2)}/>
					{/* <Paddle Hposition={98} Vposition={VRightPaddle}/> */}
				</> ) :
				<div>PRESS ENTER TO PLAY</div>
			}
		</Style>
	);
}

export default Pong


// user --> left | target ---> right 


//user move paddle emit l'info
	//server receive l'info redonne les values du paddle a au player et a l'autre  (need usertarget + challegne status acepted to work)
	//user receive et change paddle