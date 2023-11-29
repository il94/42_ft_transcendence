import styled from "styled-components"
import colors from "../../../../utils/colors"

const Style = styled.p`

	margin-right: auto;
	margin-left: auto;

	text-align: center;

	color: ${colors.historyWin};

`

type PropsWin = {
	value: number
}

function Win({ value } : PropsWin) {
	return (
		<Style>
			{value}W
		</Style>
	)
}

export default Win