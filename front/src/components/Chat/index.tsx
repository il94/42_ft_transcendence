import { Style } from "./style"
import ContactList from "./ContactList"
import ChatWindow from "./ChatWindow"

function Chat({ displayChat }: { displayChat: React.Dispatch<React.SetStateAction<boolean>> }) {
	return (
		<Style>
			<ContactList />
			<ChatWindow displayChat={displayChat} />
		</Style>
	)
}

export default Chat