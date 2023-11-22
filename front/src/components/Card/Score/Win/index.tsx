import styled from "styled-components"
import colors from "../../../../utils/colors"

const Style = styled.p`

	margin-right: auto;
	margin-left: auto;

	text-align: center;

	color: ${colors.historyWin};

`

function Win({ value } : { value: number }) {
	return (
		<Style>
			{value}W
		</Style>
	)
}

export default Win