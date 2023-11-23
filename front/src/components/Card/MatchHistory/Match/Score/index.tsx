import styled from "styled-components"
import colors from "../../../../../utils/colors"

const Style = styled.div`

	display: flex;
	align-items: center;

	font-size: 11px;

	color: ${colors.textAlt};

`

const ScoreUser = styled.p`
	
	margin-right: 2px;

`

const ScoreOpponent = styled.p`
	
	margin-left: 2px;
	
`

function Score() {
	return (
		<Style>
			<ScoreUser>
				0
			</ScoreUser>
			<p>-</p>
			<ScoreOpponent>
				0
			</ScoreOpponent>
		</Style>
	)
}

export default Score