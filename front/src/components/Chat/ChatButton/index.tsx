import { useContext } from "react"
import styled from "styled-components"
import effects from "../../../utils/effects"
import ChatIcon from "../../../assets/chat.png"
import { ChatContext } from "../../../pages/Game"

const Style = styled.img`

	position: absolute;
	right: 0;
	bottom: 0;

	width: 32px;
	height: 32px;

	margin-right: 6.5px;
	margin-bottom: 4.5px;

	cursor: pointer;

	${effects.pixelateIcon};
	${effects.shadowButton};


	border-width: 0.2em; // a definir
	/* border-width: 2.5px; */

`

function ChatButton() {

	const { displayChat } = useContext(ChatContext)!

	return (
		<Style src={ChatIcon} onClick={() => displayChat(true)}
			alt="Chat button" title="Chat" />
	)
}

export default ChatButton