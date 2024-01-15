import  {useState, useEffect, KeyboardEvent, useRef } from 'react'

import styled from 'styled-components'
import Paddle from './Paddle'
import Ball from './Ball'
import Score from './Score'

const Style = styled.div`

position: absolute;

width: 95%;
/* height: 95%; */
aspect-ratio: 16/9;

max-width: 100%;
max-height: 100%;


background-color: black;

`;

function Pong({social}){
	
	const PongRef = useRef<HTMLDivElement | null>(null)
	const [PongBounds, setPongBounds] = useState<DOMRect | undefined>(PongRef.current?.getBoundingClientRect())
	
	useEffect(() => {
		console.log("actu")
		console.log("PongRef", PongRef.current?.getBoundingClientRect())
		setPongBounds(PongRef.current?.getBoundingClientRect())
	}, [PongRef.current?.parentElement, window.innerWidth, window.innerHeight, social])

	const [VLeftPaddle, setVLeftPaddle] = useState(48);
	const [VRightPaddle, setVRightPaddle] = useState(48);

	const [gameState, setGameState] = useState(false)

	const [LeftPaddlePos, setLeftPaddlePos] = useState<{top: number, bottom: number}>({top: 0, bottom: 0})
	const [RightPaddlePos, setRightPaddlePos] = useState<{top: number, bottom: number}>({top: 0, bottom: 0})

	const [BallPos, setBallPos] = useState ({x: 0, y: 0});
	const [BallDir, setBallDir] = useState<{ x: number, y: number }>({ x: 0, y: 0 })

	const [score, setScore] = useState<{left: number, right: number}>({left: 0, right: 0})

	const [keysPressed, setKeysPressed] = useState<{ [key: string]: boolean }>({});

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
	
	const updatePaddlePosition = () => {
		const step = 1;
		let PongOne: number = 0; //Pong 1% height in px
		
		if (PongBounds)
			PongOne = PongBounds.height / 100;
		
		if (keysPressed['Enter'])
			startGame()

		if (PongBounds && (keysPressed['w'] || keysPressed['W'])) {
			if (VLeftPaddle >= 8)
			{
				setVLeftPaddle((prevSetVLeftPaddle) => (prevSetVLeftPaddle - step));
				setLeftPaddlePos({
					top: LeftPaddlePos.top - PongOne * step,
					bottom: LeftPaddlePos.bottom - PongOne * step
				});
			}
		}
		if (PongBounds && (keysPressed['s'] || keysPressed['S'])) {
			if (VLeftPaddle <= 92)
			{
				setVLeftPaddle((prevSetVLeftPaddle) => (prevSetVLeftPaddle + step));
				setLeftPaddlePos({
					top: LeftPaddlePos.top + PongOne * step,
					bottom: LeftPaddlePos.bottom + PongOne * step
				});
			}
		}
		if (PongBounds && keysPressed['ArrowUp']) {
			if (VRightPaddle >= 8)
			{
				setVRightPaddle((prevSetVRightPaddle) => (prevSetVRightPaddle - step));
				setRightPaddlePos({
					top: RightPaddlePos.top - PongOne * step,
					bottom: RightPaddlePos.bottom - PongOne * step
				});
			}
		}
		if (PongBounds && keysPressed['ArrowDown']) {
			if (VRightPaddle <= 92)
			{
				setVRightPaddle((prevSetVRightPaddle) => (prevSetVRightPaddle + step));
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
		if (keysPressed['Enter'])
			setGameState(true)
		setBallPos({
			x: PongBounds.width / 2 - (BallSize/2),
			y: PongBounds.height / 2 - (BallSize/2)	
		});
		currentBallPos = {
			x: BallPos.x + BallDir.x,
			y: BallPos.y + BallDir.y
		}
		setLeftPaddlePos({
			top: ((VLeftPaddle - (PaddleSize/2)) * (PongBounds.height / 100)),
			bottom: ((VLeftPaddle + (PaddleSize/2)) * (PongBounds.height / 100))
		});
		setRightPaddlePos({
			top: ((VRightPaddle - (PaddleSize/2)) * (PongBounds.height / 100)),
			bottom: ((VRightPaddle + (PaddleSize/2)) * (PongBounds.height / 100))
		});

	}

	const resetGame = () => {
		if (PongBounds)
		setBallPos({
			x: PongBounds.width / 2 - (BallSize/2),
			y: PongBounds.height / 2 - (BallSize/2)
		});
	}

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
				// console.log('----LEFT-----')
				// console.log("dir x ", BallDir.x)
				// console.log("dir y ", BallDir.y)
				// console.log("ball top pos y ", BallPos.y + BallDir.y)
				// console.log("ball bottom pos y ", BallPos.y + BallDir.y + BallSize)
				// console.log("Left paddle top y", LeftPaddlePos.top)
				// console.log("Left paddle bottom y", LeftPaddlePos.bottom)
				// console.log(veloY)
				// console.log("right paddle top y", RightPaddlePos.top)
				// console.log("right paddle bottom y", RightPaddlePos.bottom)
				// console.log('---------')
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
				console.log("5% = ", (PaddleSize/2) * (PongBounds.height / 100))
				console.log ("pos of ball ",  (BallPos.y + BallDir.y + BallSize/2))
				console.log("top of the ball y : ", BallPos.y + BallDir.y)
				console.log("bottom of the ball y : ", BallPos.y + BallDir.y + BallSize)
				console.log(veloY)
				console.log("top of the paddle y : ", RightPaddlePos.top)
				console.log("bottom of the paddle y : ", RightPaddlePos.bottom)
				// console.log("collision on paddle", CollisionOnPaddle)
				// console.log("final angle ", BounceAngle)
				console.log("--------")
				setBallDir({
					x: (-BallDir.x * + 1),
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
			paddleX = (PongBounds.width * 2.5 / 100);

		// console.log("just after ball pos change (in other fct)", BallPos)

		if (PaddleCollision())
		{
			//console.log("after paddlecollision ball pos change ", BallPos)
			return;
		}
		//console.log("after paddlecollision ball pos change ", BallPos)
		if (PongBounds && (currentBallPos.x < paddleX || currentBallPos.x + BallSize > PongBounds.width - paddleX))
		{
			// console.log('----SCORE-----')
			// console.log("ball pos y ", BallPos.y + BallDir.y + BallSize/2)
			// console.log("Left paddle top y", LeftPaddlePos.top)
			// console.log("Left paddle bottom y", LeftPaddlePos.bottom)
			// console.log("right paddle top y", RightPaddlePos.top)
			// console.log("right paddle bottom y", RightPaddlePos.bottom)
			// console.log('---------')
			if (BallPos.x + BallDir.x < paddleX)
				setScore((prevScore) => ({left: prevScore.left, right: prevScore.right + 1}))
			else
				setScore((prevScore) => ({left: prevScore.left + 1, right: prevScore.right}))
			resetGame()
		}
		if (PongBounds && (currentBallPos.y < 0 || currentBallPos.y + BallSize > PongBounds.height))
		{
			//if (!(BallPos.y - BallDir.y + (BallSize/2) < 0 || BallPos.y - BallDir.y + (BallSize/2) > PongBounds.height - BallSize))
			setBallDir((prevBallDir) => ({ x: prevBallDir.x, y: -prevBallDir.y }));
			// console.log("ballpos ", BallPos.y + BallDir.y + BallSize/2)
			// console.log("left paddleposbottom ", LeftPaddlePos.bottom)
			// console.log("right paddleposbottom ", RightPaddlePos.bottom)
		}
	}
	
	const updateBallPosition = () => {
		//console.log(BallDir)
		setBallPos((prevBallPos) => ({
			x: prevBallPos.x + BallDir.x,
			y: prevBallPos.y + BallDir.y,
		}));
		currentBallPos = {
			x: BallPos.x + BallDir.x,
			y: BallPos.y + BallDir.y 
		}
		checkCollision()
	}
	
	useEffect(() => {
		// console.log("useEffect ball x", BallPos.x)
		// console.log("useEffect ball y", BallPos.y)
		// console.log("useEffect dir x", BallDir.x)
		// console.log("useEffect dir y", BallDir.y)
		const animationBallId = requestAnimationFrame(updateBallPosition);

		return () => {
				cancelAnimationFrame(animationBallId);
			}
	}, [BallPos]);
		
	useEffect(() => {
		let phi: number; 
		do {
			phi = 2*Math.PI*Math.random();
		} while ((phi >= Math.PI / 3 && phi <= 2 * Math.PI / 3) || (phi >= 4 * Math.PI / 3 && phi <= 5 * Math.PI / 3))
		setBallDir({
			x: (Math.cos(phi) * 5),
			y: 0
		})
		setPongBounds(PongRef.current?.getBoundingClientRect())

	}, [])
		
	useEffect(() => {
		let phi: number; 
		do {
			phi = 2*Math.PI*Math.random();
		} while ((phi >= Math.PI / 3 && phi <= 2 * Math.PI / 3) || (phi >= 4 * Math.PI / 3 && phi <= 5 * Math.PI / 3))
		setBallDir({
			x: (Math.cos(phi) * 5),
			y: 0
		})
	}, [score])

	useEffect(() => {
			
		document.addEventListener('keydown', handleKeyDown, true);
		document.addEventListener('keyup', handleKeyUp, true);

		const animationPaddleId = requestAnimationFrame(updatePaddlePosition);
		
		return () => {
			document.removeEventListener('keydown', handleKeyDown, true);
			document.removeEventListener('keyup', handleKeyUp, true);
			cancelAnimationFrame(animationPaddleId);
		};
		
	}, [keysPressed, VLeftPaddle, VRightPaddle]);
	
	
	
	return (
		<Style ref={PongRef}>
			{
				PongRef.current && gameState ? (
				<>
					<Paddle Hposition={2} Vposition={VLeftPaddle}/>
					<Ball X={BallPos.x} Y={BallPos.y} BallSize={BallSize}/>
					<Score LeftScore={score.left} RightScore={score.right}/>
					<Paddle Hposition={98} Vposition={VRightPaddle}/>
				</> ) :
				<div>PRESS ENTER TO PLAY</div>
			}
		</Style>
	);
}

export default Pong