 
import { useEffect, useState, KeyboardEvent, useRef } from 'react';
import styled from 'styled-components';


const Style = styled.div<{ X: number ; Y: number }>`
	position: absolute;
	
	width: 30px;
	height: 30px;
	
	top: ${(props) => props.Y}px;
	left: ${(props) => props.X}px;
	
	border-radius: 50%;
	
	background-color: white
	
	`
	
	/* interface BallProps {
  		PongData: DOMRect;
	} */

type PropsBalls = {
	X: number;
	Y: number;
}

	function Ball ({X, Y}: PropsBalls) {
		
		/* const [posX, setPosX] = useState(600);
		const [posY, setPosY] = useState(400); */
/* 
		const getRandom = () => { return (Math.random() * 2 - 1) } */
		const BallRef = useRef(null)
		
		const keyHandler = (e: KeyboardEvent) => {
			if (e.key === 'Enter')
				console.log("Enter");
		}

		let speedX: number = 5;
		let speedY: number = 2;

		/* console.log(posX)
		console.log(PongData.right) */
/* 
		const updatePos = () => {

			if (posX < PongData.left || posX > PongData.right)
			setPosX((prevPosX) => (prevPosX + speedX));
			setPosY((prevPosY) => (prevPosY + speedY));
		} */


		useEffect(() => {
			const BallContainer: HTMLDivElement = BallRef.current

			if (BallContainer)
			{
				console.log("BALL = ",  BallContainer)
				console.log("BALL PARENT = ", BallContainer.parentElement)

				console.log("BALL STATS = ", BallContainer.getBoundingClientRect())
			}
		}, [])

		useEffect(() => {
			document.addEventListener('keydown', keyHandler, true);
			return () => {
				document.removeEventListener('keydown', keyHandler, true)
			}
		}, []);

	return (
		<Style X={X} Y={Y} ref={BallRef} />
	);
}

export default Ball