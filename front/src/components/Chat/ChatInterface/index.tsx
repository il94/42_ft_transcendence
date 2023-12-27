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
	channel: ChannelData,
	setChannel: Dispatch<SetStateAction<ChannelData>>
}

function ChatInterface({ channel, setChannel }: PropsChatInterface) {
	return (
		<Style>
			<Discussion channel={channel} />
			<TextInput setChannel={setChannel} />
		</Style>
	)
}

export default ChatInterface