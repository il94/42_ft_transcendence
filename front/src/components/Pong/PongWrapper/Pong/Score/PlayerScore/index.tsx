

import styled from 'styled-components';


const Style = styled.div<{ $Hposition: number; $size: number}>`
	
	position: absolute;

	font-size:${(props) => props.$size}px;

	top: 10%;
	left: ${(props) => props.$Hposition}%;

	transform: translate(-50%, -50%);

	color: white;
`


function PlayerScore({Hposition, Score, size} : {Hposition: number, Score: number, size: number}){

	return (
		<Style $Hposition={Hposition} $size={size}>
			<p>{Score}</p>
		</Style>
	);
}

export default PlayerScore