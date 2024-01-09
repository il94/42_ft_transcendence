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

	const PaddleSize: number = 10;
	const BallSize: number = 20;
	const BallSpeed: number = 5;
	
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
		const step = 2.5;
		
		if (PongBounds && (keysPressed['w'] || keysPressed['W'])) {
			setVLeftPaddle((prevSetVLeftPaddle) => (prevSetVLeftPaddle >= 9 ? prevSetVLeftPaddle - step : prevSetVLeftPaddle));
			if (LeftPaddlePos.top - PongBounds.height / 100 * step > 0)
			{
				setLeftPaddlePos((prevLeftPaddlePos) => ({
						top: prevLeftPaddlePos.top - PongBounds.height / 100 * step,
						bottom: prevLeftPaddlePos.bottom - PongBounds.height / 100 * step
					}));
			}
		}
		if (PongBounds && (keysPressed['s'] || keysPressed['S'])) {
			setVLeftPaddle((prevSetVLeftPaddle) => (prevSetVLeftPaddle <= 91 ? prevSetVLeftPaddle + step : prevSetVLeftPaddle));
			if (LeftPaddlePos.bottom + PongBounds.height / 100 * step < PongBounds.height)
			{
				setLeftPaddlePos((prevLeftPaddlePos) => ({
					top: prevLeftPaddlePos.top + PongBounds.height / 100 * step,
					bottom: prevLeftPaddlePos.bottom + PongBounds.height / 100 * step
				}));
			}
		}
		if (PongBounds && keysPressed['ArrowUp']) {
			setVRightPaddle((prevSetVRightPaddle) => (prevSetVRightPaddle >= 9 ? prevSetVRightPaddle - step : prevSetVRightPaddle));
			if (RightPaddlePos.top - PongBounds.height / 100 * step > 0)
			{
				setRightPaddlePos((prevRightPaddlePos) => ({
					top: prevRightPaddlePos.top - PongBounds.height / 100 * step,
					bottom: prevRightPaddlePos.bottom - PongBounds.height / 100 * step
				}));
			}
		}
		if (PongBounds && keysPressed['ArrowDown']) {
			setVRightPaddle((prevSetVRightPaddle) => (prevSetVRightPaddle <= 91 ? prevSetVRightPaddle + step : prevSetVRightPaddle));
			if (RightPaddlePos.bottom + PongBounds.height / 100 * step < PongBounds.height)
			{
				setRightPaddlePos((prevRightPaddlePos) => ({
					top: prevRightPaddlePos.top + PongBounds.height / 100 * step,
					bottom: prevRightPaddlePos.bottom + PongBounds.height / 100 * step
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
	}

	const PaddleCollision = () => {

		let paddleX: number = 0;

		if (PongBounds)
			paddleX = (PongBounds.width * 2.5 / 100); // 2.5 == paddle widh/2 + 2

		// console.log("ball pos X ", BallPos.x + BallDir.x);
		// console.log("right paddleX ", PongBounds.width - paddleX);
		// console.log("top Right paddle ", RightPaddlePos.top); 
		// console.log("bottom Right paddle ", RightPaddlePos.bottom); 

		if (PongBounds && BallPos.x + BallDir.x < paddleX)
		{
			if (PongBounds && BallPos.y + BallDir.y > LeftPaddlePos.top && BallPos.y + BallDir.y < LeftPaddlePos.bottom)
			{
				const CollisionOnPaddle: number = (LeftPaddlePos.top + ((PaddleSize/2) * (PongBounds.height / 100))) - (BallPos.y + BallDir.y + (BallSize/2))
				const tmp: number = (CollisionOnPaddle/ ((PaddleSize * (PongBounds.height /100) / 2 )))
				const bounceAngle = tmp * (5*Math.PI/12)
				console.log("----LEFT----")
				console.log(CollisionOnPaddle)
				console.log(tmp)
				console.log(bounceAngle)
				setBallDir({
					x: (Math.cos(-bounceAngle) * BallSpeed),
					y: (Math.sin(-bounceAngle) * BallSpeed)
				})
				return true
			}
		}
		if (PongBounds && BallPos.x + BallDir.x > PongBounds.width - paddleX - BallSize)
		{
			if (PongBounds && BallPos.y + BallDir.y > RightPaddlePos.top && BallPos.y + BallDir.y < RightPaddlePos.bottom)
			{
				const CollisionOnPaddle: number = (RightPaddlePos.top + ((PaddleSize/2) * (PongBounds.height / 100))) - (BallPos.y + BallDir.y + (BallSize/2))
				const tmp: number = (CollisionOnPaddle/ ((PaddleSize * (PongBounds.height /100) / 2 )))
				const bounceAngle = tmp * (5*Math.PI/12)

				console.log("----RIGHT	----")
				console.log("5% = ", (PaddleSize/2) * (PongBounds.height / 100))
				console.log ("pos of ball ",  (BallPos.y + BallDir.y + BallSize/2))
				console.log(CollisionOnPaddle)
				console.log(tmp)
				console.log(bounceAngle)
				setBallDir({
					x: (Math.cos(bounceAngle) * -BallSpeed),
					y: (Math.sin(bounceAngle) * -BallSpeed)
				})
				return true
			}
		}
		return false;
	}

	const updateBallPosition = () => {
		
		setBallPos((prevBallPos) => ({
			x: prevBallPos.x + BallDir.x,
			y: prevBallPos.y + BallDir.y,
		}));

		// console.log(BallDir)
		if (PaddleCollision())
		{
			// console.log(BallDir)
			return;
		}
		else
		{
			if (PongBounds && (BallPos.x + BallDir.x < 0 || BallPos.x + BallDir.x > PongBounds.width - BallSize))
			{
				console.log('score')
				if (BallPos.x + BallDir.x < 0)
					setScore((prevScore) => ({left: prevScore.left, right: prevScore.right + 1}))
				else
					setScore((prevScore) => ({left: prevScore.left + 1, right: prevScore.right}))
				resetGame()
			}
			if (PongBounds && (BallPos.y + BallDir.y < 0 || BallPos.y + BallDir.y > PongBounds.height - BallSize))
				setBallDir((prevBallDir) => ({ x: prevBallDir.x, y: -prevBallDir.y }));
		}
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
			
			const phi: number = 2*Math.PI*Math.random();
			setBallDir({
				x: (Math.cos(phi) * 5),
				y: (0 * 5)
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
				y: (0 * BallSpeed)
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