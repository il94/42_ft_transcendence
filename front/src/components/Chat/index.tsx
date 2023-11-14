import styled from "styled-components"
import effects from "../../utils/effects"

import ContactList from "./ContactList"
import ChatWindow from "./ChatWindow"

const Style = styled.div`

	display: flex;

	width: 368px;
	height: 243px;

	${effects.pixelateWindow};

`

function Chat() {
	return (
		<Style>
			<ContactList />
			<ChatWindow />
		</Style>
	)
}

export default Chat