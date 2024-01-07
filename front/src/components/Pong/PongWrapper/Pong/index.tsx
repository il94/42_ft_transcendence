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
	
	const [VLeftPaddle, setVLeftPaddle] = useState(50);
	const [VRightPaddle, setVRightPaddle] = useState(50);

	const [BallPos, setBallPos] = useState ({x: 100, y: 100});

	const [keysPressed, setKeysPressed] = useState<{ [key: string]: boolean }>({});

	const [BallDir, setBallDir] = useState<{ x: number, y: number }>({ x: 0, y: 0 })

	// let	BallDirX: number = (Math.random() * 2 - 1) * 5;
	// let	BallDirY: number = (Math.random() * 2 - 1) * 5;
	
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
		
		if (keysPressed['w'] || keysPressed['W']) {
			setVLeftPaddle((prevSetVLeftPaddle) => (prevSetVLeftPaddle >= 11 ? prevSetVLeftPaddle - step : prevSetVLeftPaddle));
		}
		if (keysPressed['s'] || keysPressed['S']) {
			setVLeftPaddle((prevSetVLeftPaddle) => (prevSetVLeftPaddle <= 89 ? prevSetVLeftPaddle + step : prevSetVLeftPaddle));
		}
		if (keysPressed['ArrowUp']) {
			setVRightPaddle((prevSetVRightPaddle) => (prevSetVRightPaddle >= 11 ? prevSetVRightPaddle - step : prevSetVRightPaddle));
		}
		if (keysPressed['ArrowDown']) {
			setVRightPaddle((prevSetVRightPaddle) => (prevSetVRightPaddle <= 89 ? prevSetVRightPaddle + step : prevSetVRightPaddle));
		}
	};
	
	const updateBallPosition = () => {
		
		setBallPos((prevBallPos) => ({
			x: prevBallPos.x + BallDir.x,
			y: prevBallPos.y + BallDir.y,
		}));
		const PongBounds = PongRef.current?.getBoundingClientRect()

		console.log("WIDTH :",  PongBounds)
		if (PongBounds && (BallPos.x + BallDir.x < 0 || BallPos.x + BallDir.x > PongBounds.width - 30))
		{
			console.log('switch')
			setBallDir((prevBallDir) => ({ x: -prevBallDir.x, y: prevBallDir.y }));
		}
		if (PongBounds && (BallPos.y + BallDir.y < 0 || BallPos.y + BallDir.y > PongBounds.height - 30))
		{
			setBallDir((prevBallDir) => ({ x: prevBallDir.x, y: -prevBallDir.y }));
		}
		// console.log("ball dir x function ",BallDir.x)
		// console.log("ball dir y function ",BallDir.y)
	}
	
	useEffect(() => {
		if (BallPos.x < 0)
			console.log("score");
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
				y: (Math.sin(phi) * 5)
			})
			
			console.log("RENDER")
			console.log("Pong STATS = ", PongRef.current?.getBoundingClientRect())
			console.log(PongRef.current?.getBoundingClientRect().left)
			console.log(PongRef.current?.getBoundingClientRect().top)
		}, [])
		
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
					{/* <Ball PongData={PongRef.current.getBoundingClientRect()}/> */}
					<Ball X={BallPos.x} Y={BallPos.y}/>
					<Score />
					<Paddle Hposition={98} Vposition={VRightPaddle}/>
				</>
			}
		</Style>
	);
}

export default Pong