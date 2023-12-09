import { Dispatch, SetStateAction } from "react"

import styled from "styled-components"

import TextInput from "./TextInput"
import Discussion from "./Discussion"
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

type PropsChatInterface = {
	channel: Channel,
	displayUpdateChannelInterface: Dispatch<SetStateAction<{
		display: boolean,
		updateChannel?: boolean
	}>>
}

function ChatInterface({ channel, displayUpdateChannelInterface } : PropsChatInterface) {
	return (
		<Style>
			<Banner
				name={channel.name}
				displaySettingsButton={true}
				displayUpdateChannelInterface={displayUpdateChannelInterface} />
			<Discussion /* messages={channel.messages} */ />
			<TextInput />
		</Style>
	)
}

export default ChatInterface