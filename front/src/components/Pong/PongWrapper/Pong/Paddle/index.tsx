
//import { useState, useEffect } from 'react';
import styled from 'styled-components'

type PropsPaddle = {
	Hposition: number;
	Vposition: number;
}
const Style = styled.div<{ Hposition: number ; Vposition: number }>`

	position: absolute;
	
	width: 20px;
	height: 150px;
	
	top: ${(props) => props.Vposition}%;
	left: ${(props) => props.Hposition}%;

	transform: translate(-50%, -50%);
	transition: top 0.2s linear, left 0.2s linear;

	background-color: white;
`

function Paddle({ Hposition, Vposition } : PropsPaddle) {


	return (
		<Style Hposition={Hposition} Vposition={Vposition}/>
	);
}

export default Paddle;