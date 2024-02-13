 
import { useEffect, useState, KeyboardEvent, useRef } from 'react';
import styled from 'styled-components';


const Style = styled.div.attrs<{ $X: number ; $Y: number ; $BallSize:number }>((props) => ({

	style: {
		
		top: `${props.$Y}px`,
		left: `${props.$X}px`,
		width: `${props.$BallSize}px`,
		height: `${props.$BallSize}px`,
	},
}))`
	position: absolute;
	
	transform: translate(-50%, -50%);

	background-color: white
	
	`

type PropsBalls = {
	X: number;
	Y: number;
	BallSize: number;
}

	function Ball ({X, Y, BallSize}: PropsBalls) {
		
		/* const [posX, setPosX] = useState(600);
		const [posY, setPosY] = useState(400); */
/* 
		const getRandom = () => { return (Math.random() * 2 - 1) } */
		const BallRef = useRef<HTMLDivElement | null>(null)
		
		
		/* console.log(posX)
		console.log(PongData.right) */
		/* 
		const updatePos = () => {
			
			if (posX < PongData.left || posX > PongData.right)
			setPosX((prevPosX) => (prevPosX + speedX));
			setPosY((prevPosY) => (prevPosY + speedY));
		} */
		
		
		/* useEffect(() => {
			const BallContainer: HTMLDivElement = BallRef.current
			
			if (BallContainer)
			{
				console.log("BALL = ",  BallContainer)
				console.log("BALL PARENT = ", BallContainer.parentElement)
				
				console.log("BALL STATS = ", BallContainer.getBoundingClientRect())
			}
		}, [X, Y]) */
		

		useEffect(() => {
		}, []);

	return (
		<Style $X={X} $Y={Y} $BallSize={BallSize} ref={BallRef} />
	);
}

export default Ball