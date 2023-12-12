import styled from "styled-components"

import TextInput from "./TextInput"
import Discussion from "./Discussion"

import { ChannelData } from "../../../utils/types"

import colors from "../../../utils/colors"

const Style = styled.div`

	display: flex;
	flex-direction: column;

	width: 245px;

	background-color: ${colors.chatWindow};

`

type PropsChatInterface = {
	channelTarget: ChannelData
}

function ChatInterface({ channelTarget } : PropsChatInterface) {
	return (
		<Style>
			<Discussion channelTarget={channelTarget} />
			<TextInput channelTarget={channelTarget} />
		</Style>
	)
}

export default ChatInterface