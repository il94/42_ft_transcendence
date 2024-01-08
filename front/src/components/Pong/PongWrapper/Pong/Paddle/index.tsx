
//import { useState, useEffect } from 'react';


import styled from 'styled-components'

type PropsPaddle = {
	Hposition: number;
	Vposition: number;
}

const Style = styled.div<{ $Hposition: number ; $Vposition: number }>`

	position: absolute;
	
	width: 1%;
	height: 18%;
	
	top: ${(props) => props.$Vposition}%;
	left: ${(props) => props.$Hposition}%;

	transform: translate(-50%, -50%);
	/* transition: top 0.1s linear, left 0.1s linear; */

	background-color: white;
`

function Paddle({ Hposition, Vposition } : PropsPaddle) {


	return (
		<Style $Hposition={Hposition} $Vposition={Vposition}/>
	);
}

export default Paddle;