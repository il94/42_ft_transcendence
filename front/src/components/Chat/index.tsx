import { Style } from "./style"
import ContactList from "./ContactList"
import ChatWindow from "./ChatWindow"

function Chat() {
	return (
		<Style>
			<ContactList />
			<ChatWindow />
		</Style>
	)
}

export default Chat