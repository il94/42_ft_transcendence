import styled from "styled-components"

import TextInput from "./TextInput"
import Discussion from "./Discussion"

import colors from "../../../utils/colors"

const Style = styled.div`

	display: flex;
	flex-direction: column;

	width: 100%;
	height: 100%;

	background-color: ${colors.chatWindow};

`

function ChatInterface() {
	return (
		<Style>
			<Discussion />
			<TextInput />
		</Style>
	)
}

export default ChatInterface