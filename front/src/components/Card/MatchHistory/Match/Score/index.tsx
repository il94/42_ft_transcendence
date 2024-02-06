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

	color: ${colors.textAlt};

`

const ScoreOpponent = styled.p`
	
	margin-left: 2px;
	
	color: ${colors.textAlt};

`

const Separator = styled.p`

	color: ${colors.textAlt};
	
`

type PropsScore = {
	scoreUser: number,
	scoreOpponent: number
}

function Score({ scoreUser, scoreOpponent }: PropsScore) {
	return (
		<Style>
			<ScoreUser>
				{scoreUser}
			</ScoreUser>
			<Separator>
				-
			</Separator>
			<ScoreOpponent>
				{scoreOpponent}
			</ScoreOpponent>
		</Style>
	)
}

export default Score