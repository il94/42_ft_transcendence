import styled from "styled-components"

import TextInput from "./TextInput"
import Discussion from "./Discussion"

import { Channel } from "../../../utils/types"

import colors from "../../../utils/colors"

const Style = styled.div`

	display: flex;
	flex-direction: column;

	width: 245px;

	background-color: ${colors.chatWindow};

`

type PropsChatInterface = {
	channel: Channel | undefined
}

function ChatInterface({ channel } : PropsChatInterface) {
	return (
		<Style>
		{
			channel ?
			<>
				<Discussion /* messages={channel.messages} */ />
				<TextInput />
			</>
			:
			"Ce channel n'existe pas" // prevoir composant pour afficher l'erreur
		}
		</Style>
	)
}

export default ChatInterface