import { Style, DiscussionInterface } from "./style"
import TextInput from "./TextInput"
import Banner from "./Banner"

function ChatWindow({ displayChat }: { displayChat: React.Dispatch<React.SetStateAction<boolean>> }) {
	return (
		<Style>
			<Banner displayChat={displayChat} />
			<DiscussionInterface />
			<TextInput />
		</Style>
	)
}

export default ChatWindow