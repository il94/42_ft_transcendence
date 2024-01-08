import styled from "styled-components"

import TextInput from "./TextInput"
import Discussion from "./Discussion"

import { Channel } from "../../../utils/types"

import colors from "../../../utils/colors"
import { Dispatch, SetStateAction } from "react"

const Style = styled.div`

	display: flex;
	flex-direction: column;

	width: 245px;

	background-color: ${colors.chatWindow};

`

type PropsChatInterface = {
	channel: Channel,
	setChannel: Dispatch<SetStateAction<Channel>>
}

function ChatInterface({ channel, setChannel }: PropsChatInterface) {
	return (
		<Style>
			<Discussion channel={channel} />
			<TextInput
				channel={channel}
				setChannel={setChannel} />
		</Style>
	)
}

export default ChatInterface