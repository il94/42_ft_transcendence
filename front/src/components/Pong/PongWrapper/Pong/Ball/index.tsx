 
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
		
		const BallRef = useRef<HTMLDivElement | null>(null)	

	return (
		<Style $X={X} $Y={Y} $BallSize={BallSize} ref={BallRef} />
	);
}

export default Ball