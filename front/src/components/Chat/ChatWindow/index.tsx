import styled from "styled-components"
import colors from "../../../utils/colors"

import TextInput from "./TextInput"
import DiscussionInterface from "./DiscussionInterface"
import Banner from "./Banner"

const Style = styled.div`

	display: flex;
	flex-direction: column;

	width: 66.58%;
	height: 100%;

	background-color: ${colors.chatWindow};

`

function ChatWindow() {
	return (
		<Style>
			<Banner />
			<DiscussionInterface />
			<TextInput />
		</Style>
	)
}

export default ChatWindow