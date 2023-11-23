import { useContext } from "react"

import { Style, ChatButton } from "./style"

import ContactList from "./ContactList"
import ChatWindow from "./ChatWindow"
import ChatContext from "../../contexts/ChatContext"
import ZIndexContext from "../../contexts/ZIndexContext"

import ChatIcon from "../../assets/chat.png"

function Chat() {

	const { chat, displayChat } = useContext(ChatContext)!
	const { zCardIndex, setZChatIndex } = useContext(ZIndexContext)!

	return (
		chat ?
		<Style onClick={() => {setZChatIndex(zCardIndex - 1)}} $zIndex={zCardIndex - 1}>
			<ContactList />
			<ChatWindow />
		</Style>
		:
		<ChatButton src={ChatIcon} onClick={() => {displayChat(true); setZChatIndex(zCardIndex - 1)}}
			alt="Chat button" title="Chat"/>
	)
}

export default Chat