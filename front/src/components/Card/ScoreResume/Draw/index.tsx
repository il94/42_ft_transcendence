import styled from "styled-components"
import colors from "../../../../utils/colors"

const Style = styled.p`

	margin-right: auto;
	margin-left: auto;

	text-align: center;

	color: ${colors.historyDraw};
`

function Draw({ value } : { value: number }) {
	return (
		<Style>
			{value}D
		</Style>
	)
}

export default Draw