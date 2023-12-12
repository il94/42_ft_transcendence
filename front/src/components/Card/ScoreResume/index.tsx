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
	scoreResume: {
		wins: number,
		draws: number,
		looses: number
	}
}

function ScoreResume({ scoreResume } : PropsScoreResume) {
	return (
		<Style>
			<Win value={scoreResume.wins} />
			<Draw value={scoreResume.draws} />
			<Loose value={scoreResume.looses} />
		</Style>
	)
}

export default ScoreResume