import  {useState, useEffect, KeyboardEvent } from 'react'

import styled from 'styled-components'
import Paddle from './Paddle'
import Ball from './Ball'
import Score from './Score'

const Style = styled.div`

position: relative;

height: 95%;
width: 95%;

background-color: black;

`;

function Pong(){
	
	const [VLeftPaddle, setVLeftPaddle] = useState(50);
	const [VRightPaddle, setVRightPaddle] = useState(50);
	const [keysPressed, setKeysPressed] = useState<{ [key: string]: boolean }>({});
	

	const handleKeyDown = (event: KeyboardEvent) => {
		
		event.preventDefault();
		event.stopPropagation();

		setKeysPressed((prevKeys) => ({ ...prevKeys, [event.key]: true }));


		// if (event.key === "ArrowUp" && VRightPaddle >= 11)
		// 	setVRightPaddle((prevVRightPaddle) => prevVRightPaddle - 2.5);
		// if (event.key === "ArrowDown" && VRightPaddle <= 89)
		// 	setVRightPaddle((prevVRightPaddle) => prevVRightPaddle + 2.5);

		// if ((event.key === "w" || event.key === "W") && VLeftPaddle >= 11)
		// 	setVLeftPaddle((prevVLeftPaddle) => prevVLeftPaddle - 2.5);
		// if ((event.key === "s" || event.key === "S") && VLeftPaddle <= 89)
		// 	setVLeftPaddle((prevVLeftPaddle) => prevVLeftPaddle + 2.5)
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
	
		//requestAnimationFrame(updatePaddlePosition);
	  };

	useEffect(() => {
		document.addEventListener('keydown', handleKeyDown, true);
		document.addEventListener('keyup', handleKeyUp, true);

		const animationId = requestAnimationFrame(updatePaddlePosition);

		return () => {
			document.removeEventListener('keydown', handleKeyDown, true);
			document.removeEventListener('keyup', handleKeyUp, true);
			cancelAnimationFrame(animationId);
		};
	
	}, [keysPressed, VLeftPaddle, VRightPaddle]);


	return (
		<Style>
			<Paddle Hposition={2} Vposition={VLeftPaddle}/>
			<Ball />
			<Score />
			<Paddle Hposition={98} Vposition={VRightPaddle}/>
		</Style>
	);
}

export default Pong