import { Style, DiscussionInterface } from "./style"
import TextInput from "./TextInput"
import Banner from "./Banner"

function ChatWindow() {
	return (
		<Style>
			<Banner />
			<DiscussionInterface />
			<TextInput />
		</Style>
	)
}

export default ChatWindow