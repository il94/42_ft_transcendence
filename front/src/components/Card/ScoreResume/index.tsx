import styled from "styled-components"

import Draw from "./Draw"
import Loose from "./Loose"
import Win from "./Win"

const Style = styled.div`

	display: flex;
	align-items: center;

	width: 100%;

	margin-top: 8px;

	font-size: 15px;

`

type PropsScoreResume = {
	wins: number,
	draws: number,
	losses: number
}

function ScoreResume({ wins, draws, losses }: PropsScoreResume) {
	return (
		<Style>
			<Win value={wins} />
			<Draw value={draws} />
			<Loose value={losses} />
		</Style>
	)
}

export default ScoreResume