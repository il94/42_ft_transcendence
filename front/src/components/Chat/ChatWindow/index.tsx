import styled from "styled-components"

import TextInput from "./TextInput"
import DiscussionInterface from "./DiscussionInterface"
import Banner from "./Banner"

import colors from "../../../utils/colors"

const Style = styled.div`

	display: flex;
	flex-direction: column;

	width: 245px;
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