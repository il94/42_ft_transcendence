import { useState } from "react"
import { ChatButton, Style } from "./style"
import Chat from "../Chat"
import ChatIcon from "../../assets/chat.png"

function Pong() {

	const [chat, displayChat] = useState<boolean>(false)

	return (
		<Style>
		{
			chat ?
				<Chat displayChat={displayChat} />
				:
				<ChatButton src={ChatIcon} onClick={() => displayChat(true)}/>
		}
		</Style>
	)
}

export default Pong