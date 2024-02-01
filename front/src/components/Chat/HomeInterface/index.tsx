import styled from "styled-components"

import colors from "../../../utils/colors"

const Style = styled.div`

	display: flex;
	justify-content: center;
	align-items: center;

	width: 100%;
	height: 100%;

	background-color: ${colors.chatWindow};

`

const Text = styled.p`
	font-size: 16px;
	text-align: center;
`

function HomeInterface() {
	return (
		<Style>
			<Text>
				Create or join a channel to start a discussion
			</Text>
		</Style>
	)
}

export default HomeInterface