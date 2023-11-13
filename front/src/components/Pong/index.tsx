import { ChatButton, Style } from "./style"
import Chat from "../Chat"
import ChatIcon from "../../assets/chat.png"

function Pong({ chat, displayChat } : { chat: boolean, displayChat: React.Dispatch<React.SetStateAction<boolean>>} ) {

	return (
		<Style>
		{
			chat ?
				<Chat displayChat={displayChat} />
				:
				<ChatButton src={ChatIcon} onClick={() => displayChat(true)}
					alt="Chat button" title="Chat" />
		}
		</Style>
	)
}

export default Pong