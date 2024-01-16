

import styled from 'styled-components';


const Style = styled.div<{ $Hposition: number }>`
	
	position: absolute;

	font-size:50px;

	top: 10%;
	left: ${(props) => props.$Hposition}%;

	transform: translate(-50%, -50%);

	color: white;
`


function PlayerScore({Hposition, Score} : {Hposition: number, Score: number}){

	return (
		<Style $Hposition={Hposition}>
			<p>{Score}</p>
		</Style>
	);
}

export default PlayerScore