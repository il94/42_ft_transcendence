

import {useState} from 'react';
import styled from 'styled-components';


const Style = styled.div<{ Hposition: number }>`
	
	position: absolute;

	font-size:50px;

	top: 10%;
	left: ${(props) => props.Hposition}%;

	transform: translate(-50%, -50%);

	color: white;
`

function PlayerScore({Hposition} : {Hposition: number}){

	const [score, setScore] = useState(0);

	const handleScore = () => {
		setScore(score + 1);
	};

	return (
		<Style Hposition={Hposition}>
			<p onClick={handleScore}>{score}</p>
		</Style>
	);
}

export default PlayerScore