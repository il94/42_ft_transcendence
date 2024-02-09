
//import { useState, useEffect } from 'react';


import { useContext, useEffect, useRef } from 'react';
import styled from 'styled-components'
import colors from '../../../../../utils/colors';
import PongContext from '../../../../../contexts/PongContext';

type PropsPaddle = {
	Hposition: number;
	Vposition: number;
	handleKeyDown?: any;
	handleKeyUp?: any;
	tabIndex: number
}

const Style = styled.div.attrs<{ $Hposition: number ; $Vposition: number }>((props) => ({

	style: {
		top: `${props.$Vposition}px`,
		left: `${props.$Hposition}%`,
	},
}))`
	position: absolute;
	z-index: -1;

	width: 1%;
	height: 10%;
	

	transform: translate(-50%, -50%);
	/* transition: top 0.1s linear, left 0.1s linear; */

	background-color: white;

	&:focus {
		outline: none;	
		background-color: #fcfc3b;
	}

	`

function Paddle({ Hposition, Vposition, handleKeyDown, handleKeyUp, tabIndex } : PropsPaddle) {


	const paddleRef = useRef<HTMLDivElement>(null)
	const {focusPaddle, setFocusPaddle} = useContext(PongContext)! 

	useEffect(() => {
		const PaddleContainer = paddleRef.current
		if (PaddleContainer && tabIndex !== -1 && focusPaddle){
			PaddleContainer.focus()
		}
	}, [focusPaddle])

	return (
		<Style onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} onBlur={() => {setFocusPaddle(false)}} tabIndex={tabIndex} $Hposition={Hposition} $Vposition={Vposition} ref={paddleRef} />
	);
}

export default Paddle;