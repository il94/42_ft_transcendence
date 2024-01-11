import  {useState, useEffect, KeyboardEvent, useRef } from 'react'

import styled from 'styled-components'
import Paddle from './Paddle'
import Ball from './Ball'
import Score from './Score'

const Style = styled.div`

position: absolute;

height: 95%;
width: 95%;

background-color: black;

`;

function Pong(){
	
	const PongRef = useRef<HTMLDivElement | null>(null)
	const PongBounds = PongRef.current?.getBoundingClientRect()
	
	const [VLeftPaddle, setVLeftPaddle] = useState(50);
	const [VRightPaddle, setVRightPaddle] = useState(50);

	const [LeftPaddlePos, setLeftPaddlePos] = useState<{top: number, bottom: number}>({top: 0, bottom: 0})
	const [RightPaddlePos, setRightPaddlePos] = useState<{top: number, bottom: number}>({top: 0, bottom: 0})

	const [BallPos, setBallPos] = useState ({x: 0, y: 0});
	const [BallDir, setBallDir] = useState<{ x: number, y: number }>({ x: 0, y: 0 })

	const [score, setScore] = useState<{left: number, right: number}>({left: 0, right: 0})

	const [keysPressed, setKeysPressed] = useState<{ [key: string]: boolean }>({});
	const [BallSpeed, setBallSpeed] = useState(5);

	const PaddleSize: number = 10;
	const BallSize: number = 20;
	
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
			updateBallPosition()

		if (PongBounds && (keysPressed['w'] || keysPressed['W'])) {
			setVLeftPaddle((prevSetVLeftPaddle) => (prevSetVLeftPaddle >= 8 ? prevSetVLeftPaddle - step : prevSetVLeftPaddle));
			if (LeftPaddlePos.top - (PongOne * step) > 0)
			{
				setLeftPaddlePos((prevLeftPaddlePos) => ({
					top: prevLeftPaddlePos.top - PongOne * step,
					bottom: prevLeftPaddlePos.bottom - PongOne * step
				}));
			}
		}
		if (PongBounds && (keysPressed['s'] || keysPressed['S'])) {
			setVLeftPaddle((prevSetVLeftPaddle) => (prevSetVLeftPaddle <= 92 ? prevSetVLeftPaddle + step : prevSetVLeftPaddle));
			if (LeftPaddlePos.bottom + (PongOne * step) < PongBounds.height)
			{
				setLeftPaddlePos((prevLeftPaddlePos) => ({
					top: prevLeftPaddlePos.top + PongOne * step,
					bottom: prevLeftPaddlePos.bottom + PongOne * step
				}));
			}
		}
		if (PongBounds && keysPressed['ArrowUp']) {
			setVRightPaddle((prevSetVRightPaddle) => (prevSetVRightPaddle >= 8 ? prevSetVRightPaddle - step : prevSetVRightPaddle));
			if (RightPaddlePos.top - (PongOne * step) > 0)
			{
				setRightPaddlePos((prevRightPaddlePos) => ({
					top: prevRightPaddlePos.top - PongOne * step,
					bottom: prevRightPaddlePos.bottom - PongOne * step
				}));
			}
		}
		if (PongBounds && keysPressed['ArrowDown']) {
			setVRightPaddle((prevSetVRightPaddle) => (prevSetVRightPaddle <= 92 ? prevSetVRightPaddle + step : prevSetVRightPaddle));
			if (RightPaddlePos.bottom + (PongOne * step) < PongBounds.height)
			{
				setRightPaddlePos((prevRightPaddlePos) => ({
					top: prevRightPaddlePos.top + PongOne * step,
					bottom: prevRightPaddlePos.bottom + PongOne * step
				}));
			}
		}
	};

	const resetGame = () => {
		if (PongRef.current?.getBoundingClientRect())
		setBallPos({
			x: PongRef.current.getBoundingClientRect().width / 2 - (BallSize/2),
			y: PongRef.current.getBoundingClientRect().height / 2 - (BallSize/2)
		});
		setBallSpeed(5)
	}

	const PaddleCollision = () => {

		let paddleX: number = 0;

		if (PongBounds)
			//paddleX = 27; // 2.5 == paddle widh/2 + 2
			paddleX = (PongBounds.width * 2.5 / 100); // 2.5 == paddle widh/2 + 2

		// console.log("ball pos X ", BallPos.x + BallDir.x);
		// console.log("right paddleX ", PongBounds.width - paddleX);
		// console.log("top Right paddle ", RightPaddlePos.top); 
		// console.log("bottom Right paddle ", RightPaddlePos.bottom); 

		if (PongBounds && BallPos.x + BallDir.x < paddleX)
		{
			console.log('----on LEFT paddle collision-----')
				console.log("ball top pos y ", BallPos.y + BallDir.y)
				console.log("ball bottom pos y ", BallPos.y + BallDir.y + BallSize)
				console.log("Left paddle top y", LeftPaddlePos.top)
				console.log("Left paddle bottom y", LeftPaddlePos.bottom)
				console.log("right paddle top y", RightPaddlePos.top)
				console.log("right paddle bottom y", RightPaddlePos.bottom)
				console.log('---------')
			if (PongBounds && ((BallPos.y + BallDir.y + BallSize >= LeftPaddlePos.top  && BallPos.y + BallDir.y + BallSize <= LeftPaddlePos.bottom) || (BallPos.y + BallDir.y <= LeftPaddlePos.bottom && BallPos.y + BallDir.y >= LeftPaddlePos.top)))
			{
				const MaxAngle: number = 0.75; 
				const PaddleSizePx = LeftPaddlePos.bottom - LeftPaddlePos.top 
				const CollisionOnPaddle: number = (LeftPaddlePos.top + PaddleSizePx/2) - (BallPos.y + BallDir.y + (BallSize/2))
				let BounceAngle: number = (CollisionOnPaddle / (PaddleSizePx/2))
				if (BounceAngle > MaxAngle)
					BounceAngle = MaxAngle
				else if (BounceAngle < -MaxAngle)
					BounceAngle = -MaxAngle
				
				console.log("----LEFT----")
				console.log("1% = ", (PongBounds.height / 100))
				console.log ("pos of ball ",  (BallPos.y + BallDir.y + BallSize/2))
				console.log("top of the ball y : ", BallPos.y + BallDir.y)
				console.log("bottom of the ball y : ", BallPos.y + BallDir.y + BallSize)
				console.log("top of the paddle y : ", LeftPaddlePos.top)
				console.log("middle of paddle px", LeftPaddlePos.top + (PaddleSizePx/2))
				console.log("bottom of the paddle y : ", LeftPaddlePos.bottom)
				console.log("collision on paddle", CollisionOnPaddle)
				console.log("final angle ", BounceAngle)
				console.log("--------")
				setBallDir({
					x: (Math.cos(-BounceAngle) * BallSpeed),
					y: (Math.sin(-BounceAngle) * BallSpeed)
				})
				return true
			}
		}
		if (PongBounds && BallPos.x + BallDir.x + BallSize > PongBounds.width - paddleX)
		{
			if (PongBounds && ((BallPos.y + BallDir.y + BallSize >= RightPaddlePos.top  && BallPos.y + BallDir.y + BallSize <= RightPaddlePos.bottom) || (BallPos.y + BallDir.y <= RightPaddlePos.bottom && BallPos.y + BallDir.y >= RightPaddlePos.top)))
			{
				const MaxAngle = 0.75
				const PaddleSizePx = RightPaddlePos.bottom - RightPaddlePos.top 
				const CollisionOnPaddle: number = (RightPaddlePos.top + PaddleSizePx/2) - (BallPos.y + BallDir.y + (BallSize/2))
				let BounceAngle: number = (CollisionOnPaddle / (PaddleSizePx/2))
				if (BounceAngle > MaxAngle)
					BounceAngle = MaxAngle
				else if (BounceAngle < -MaxAngle)
					BounceAngle = -MaxAngle

				console.log("----RIGHT----")
				console.log("5% = ", (PaddleSize/2) * (PongBounds.height / 100))
				console.log ("pos of ball ",  (BallPos.y + BallDir.y + BallSize/2))
				console.log("top of the ball y : ", BallPos.y + BallDir.y)
				console.log("bottom of the ball y : ", BallPos.y + BallDir.y + BallSize)
				console.log("top of the paddle y : ", RightPaddlePos.top)
				console.log("middle of paddle px", RightPaddlePos.top + (PaddleSizePx/2))
				console.log("bottom of the paddle y : ", RightPaddlePos.bottom)
				console.log("collision on paddle", CollisionOnPaddle)
				console.log("final angle ", BounceAngle)
				console.log("--------")
				setBallDir({
					x: (Math.cos(BounceAngle) * -BallSpeed),
					y: (Math.sin(BounceAngle) * -BallSpeed)
				})
				return true
			}
		}
		return false;
	}

	const updateBallPosition = () => {
		
		let paddleX: number = 0;

		if (PongBounds)
			paddleX = (PongBounds.width * 2.5 / 100);

		setBallPos((prevBallPos) => ({
			x: prevBallPos.x + BallDir.x,
			y: prevBallPos.y + BallDir.y,
		}));

		// console.log(BallDir)
		if (PaddleCollision())
		{
			setBallSpeed((prevBallSpeed) => (
				prevBallSpeed + 1
			));
			return;
		}
		else
		{
			if (PongBounds && (BallPos.x + BallDir.x < paddleX || BallPos.x + BallDir.x + BallSize > PongBounds.width - paddleX))
			{
				console.log('----SCORE-----')
				console.log("ball pos y ", BallPos.y + BallDir.y + BallSize/2)
				console.log("Left paddle top y", LeftPaddlePos.top)
				console.log("Left paddle bottom y", LeftPaddlePos.bottom)
				console.log("right paddle top y", RightPaddlePos.top)
				console.log("right paddle bottom y", RightPaddlePos.bottom)
				console.log('---------')
				if (BallPos.x + BallDir.x < paddleX)
					setScore((prevScore) => ({left: prevScore.left, right: prevScore.right + 1}))
				else
					setScore((prevScore) => ({left: prevScore.left + 1, right: prevScore.right}))
				resetGame()
			}
			if (PongBounds && (BallPos.y + BallDir.y < 0 || BallPos.y + BallDir.y + BallSize > PongBounds.height))
			{
				//if (!(BallPos.y - BallDir.y + (BallSize/2) < 0 || BallPos.y - BallDir.y + (BallSize/2) > PongBounds.height - BallSize))
				setBallDir((prevBallDir) => ({ x: prevBallDir.x, y: -prevBallDir.y }));
				// console.log("ballpos ", BallPos.y + BallDir.y + BallSize/2)
				// console.log("left paddleposbottom ", LeftPaddlePos.bottom)
				// console.log("right paddleposbottom ", RightPaddlePos.bottom)
			}
		}
	}
	
	// useEffect(() => {
	// 	// console.log("useEffect ball x", BallPos.x)
	// 	// console.log("useEffect ball y", BallPos.y)
	// 	// console.log("useEffect dir x", BallDir.x)
	// 	// console.log("useEffect dir y", BallDir.y)
	// 	const animationBallId = requestAnimationFrame(updateBallPosition);

	// 	return () => {
	// 			cancelAnimationFrame(animationBallId);
	// 		}
	// 	}, [BallPos]);
		
		useEffect(() => {
			
			const phi: number = 2*Math.PI*Math.random();
			setBallDir({
				x: (Math.cos(phi) * BallSpeed),
				y: 0
			})

			if (PongRef.current?.getBoundingClientRect())
			{
				setBallPos({
					x: PongRef.current.getBoundingClientRect().width / 2 - (BallSize/2),
					y: PongRef.current.getBoundingClientRect().height / 2 - (BallSize/2)	
				});
				setLeftPaddlePos({
					top: ((VLeftPaddle - (PaddleSize/2)) * PongRef.current.getBoundingClientRect().height / 100),
					bottom: ((VLeftPaddle + (PaddleSize/2)) * PongRef.current.getBoundingClientRect().height / 100)
				});
				setRightPaddlePos({
					top: ((VRightPaddle - (PaddleSize/2)) * PongRef.current.getBoundingClientRect().height / 100),
					bottom: ((VRightPaddle + (PaddleSize/2)) * PongRef.current.getBoundingClientRect().height / 100)
				});
			}
		}, [])
		
		useEffect(() => {
			let phi: number; 
			do {
				phi = 2*Math.PI*Math.random();
			} while ((phi >= Math.PI / 3 && phi <= 2 * Math.PI / 3) || (phi >= 4 * Math.PI / 3 && phi <= 5 * Math.PI / 3))
			setBallDir({
				x: (Math.cos(phi) * BallSpeed),
				y: (Math.sin(phi) * BallSpeed)
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
				PongRef.current &&
				<>
					<Paddle Hposition={2} Vposition={VLeftPaddle}/>
					<Ball X={BallPos.x} Y={BallPos.y} BallSize={BallSize}/>
					<Score LeftScore={score.left} RightScore={score.right}/>
					<Paddle Hposition={98} Vposition={VRightPaddle}/>
				</>
			}
		</Style>
	);
}

export default Pong