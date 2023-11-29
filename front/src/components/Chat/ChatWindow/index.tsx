import styled from "styled-components"

import TextInput from "./TextInput"
import DiscussionInterface from "./DiscussionInterface"
import Banner from "./Banner"

import { Channel } from "../../../utils/types"

import colors from "../../../utils/colors"

const Style = styled.div`

	display: flex;
	flex-direction: column;

	width: 245px;
	height: 100%;

	background-color: ${colors.chatWindow};

`

type PropsChatWindow = {
	toDisplay: Channel
}

function ChatWindow({ toDisplay } : PropsChatWindow) {
	return (
		<Style>
			<Banner name={toDisplay.name} />
			<DiscussionInterface /* targetId={toDisplay.id} */ />
			<TextInput />
		</Style>
	)
}

export default ChatWindow