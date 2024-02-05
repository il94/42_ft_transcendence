
//import { useState, useEffect } from 'react';


import styled from 'styled-components'

type PropsPaddle = {
	Hposition: number;
	Vposition: number;
}

const Style = styled.div.attrs<{ $Hposition: number ; $Vposition: number }>((props) => ({

	style: {
		top: `${props.$Vposition}px`,
		left: `${props.$Hposition}%`,
	},
}))`
	position: absolute;
	
	width: 1%;
	height: 10%;
	

	transform: translate(-50%, -50%);
	transition: top 0.1s linear, left 0.1s linear;

	background-color: white;
	`

function Paddle({ Hposition, Vposition } : PropsPaddle) {


	return (
		<Style $Hposition={Hposition} $Vposition={Vposition}/>
	);
}

export default Paddle;