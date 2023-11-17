import styled from "styled-components"
import effects from "../../utils/effects"

import ContactList from "./ContactList"
import ChatWindow from "./ChatWindow"

import { ChatContext } from "../../pages/Game"

const Style = styled.div`

	display: flex;

	position: absolute;
	right: 0;
	bottom: 0;

	width: 368px;
	height: 243px;

	${effects.pixelateWindow};

`

function Chat() {
	return (
		<Style>
							{/* <ChatContext.Provider value={{ chat, displayChat, contactListScrollValue, setContactListScrollValue, chatScrollValue, setChatScrollValue, chatRender, setChatRender }}> */}
			<ContactList />
			<ChatWindow />
			{/* </ChatContext.Provider> */}
		</Style>
	)
}

export default Chat