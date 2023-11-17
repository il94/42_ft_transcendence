import { useContext } from "react"
import { Style, ChatButton } from "./style"
import ContactList from "./ContactList"
import ChatWindow from "./ChatWindow"
import { ChatContext } from "../../pages/Game"
import ChatIcon from "../../assets/chat.png"

function Chat() {

	const { chat, displayChat } = useContext(ChatContext)!

	return (
		chat ?
		<Style>
			<ContactList />
			<ChatWindow />
		</Style>
		:
		<ChatButton src={ChatIcon} onClick={() => displayChat(true)}
			alt="Chat button" title="Chat"/>
	)
}

export default Chat