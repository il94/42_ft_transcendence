import styled from "styled-components"

import TextInput from "./TextInput"
import Discussion from "./Discussion"

import { ChannelData } from "../../../utils/types"

import colors from "../../../utils/colors"
import { Dispatch, SetStateAction } from "react"

const Style = styled.div`

	display: flex;
	flex-direction: column;

	width: 245px;

	background-color: ${colors.chatWindow};

`

type PropsChatInterface = {
	channelTarget: ChannelData | undefined,
	setChannelTarget: Dispatch<SetStateAction<ChannelData | undefined>>
}

function ChatInterface({ channelTarget, setChannelTarget }: PropsChatInterface) {
	return (
		<Style>
			<Discussion channelTarget={channelTarget} />
			<TextInput setChannelTarget={setChannelTarget} />
		</Style>
	)
}

export default ChatInterface