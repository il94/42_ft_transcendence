import styled from "styled-components"

import colors from "../../../../utils/colors"

const Style = styled.p`

	margin-right: auto;
	margin-left: auto;

	text-align: center;

	color: ${colors.historyLoose};

`

type PropsLoose = {
	value: number
}

function Loose({ value }: PropsLoose) {
	return (
		<Style>
			{value}L
		</Style>
	)
}

export default Loose