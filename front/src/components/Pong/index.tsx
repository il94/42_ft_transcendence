import { useContext } from "react"
import { ChatButton, Style } from "./style"
import Chat from "../Chat"
import { ChatContext } from "../../pages/Game"
import ChatIcon from "../../assets/chat.png"

function Pong() {
	
	const { chat, displayChat } = useContext(ChatContext)!

	return (
		<Style>
		{
			chat ?
				<Chat />
				:
				<ChatButton src={ChatIcon} onClick={() => displayChat(true)}
					alt="Chat button" title="Chat" />
		}
		</Style>
	)
}

export default Pong