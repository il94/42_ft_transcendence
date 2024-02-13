
import styled from 'styled-components';

const Style = styled.div`
	
	display: flex;
	justify-content: space-between;
	align-items: center;

	width: 95%;
	height: 15%;

`

const Score = styled.div`
	
	display: flex;
	justify-content: space-between;
	align-items: center;

	width: 32.5%;
	/* height: 10%; */

`

const Value = styled.div<{ $size: number}>`
	
	font-size:${(props) => props.$size / 15}px;

`


const NameStyle = styled.div<{ $Hpos: number, $height: number }>`
	/* position: absolute; */

	display: flex;
	justify-content: center;
	align-items: center;

	/* height: 50%; */

	font-size: ${(props) => props.$height / 18}px;
	/* margin-left: 1.5%;
	margin-right: 1.5%;
	margin-top: 3.17%; */

	/* top: 10%;
	left: ${(props) => props.$Hpos}%; */

	/* transform: translate(0, -50%); */

	color: white;
`

type ScoreProps = {
	LeftScore: number;
	RightScore: number;
	leftName: string;
	rightName: string;
	height: number;
  };

function ScoreWrapper({ LeftScore, RightScore, leftName, rightName, height }: ScoreProps){

	return (
		<Style>
			<Score>
				<NameStyle $Hpos={10} $height={height}>{leftName}</NameStyle>
				<Value $size={height}>
					{LeftScore}
				</Value>
				{/* <PlayerScore Hposition = {30} Score={LeftScore} size={height}/> */}
				

			</Score>
			<Score>
				<Value $size={height}>
					{RightScore}
				</Value>
				<NameStyle $Hpos={90} $height={height}>{rightName}</NameStyle>
				{/* <PlayerScore Hposition = {70} Score={RightScore} size={height}/> */}
			</Score>
		</Style>
		
	);
}

export default ScoreWrapper;