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

function ScoreResume() {
	return (
		<Style>
			<Win value={0} />
			<Draw value={0} />
			<Loose value={0} />
		</Style>
	)
}

export default ScoreResume