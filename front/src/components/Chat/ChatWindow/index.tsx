import { Style, Banner, ChannelName, ReduceButton, DiscussionInterface } from "./style"
import TextInput from "./TextInput"
import ReduceIcon from "../../../assets/reduce.png"

function ChatWindow({ displayChat }: { displayChat: React.Dispatch<React.SetStateAction<boolean>> }) {
	return (
		<Style>
			<Banner>
				<ChannelName>
					Example
				</ChannelName>
				<ReduceButton src={ReduceIcon} onClick={() => displayChat(false)}
					alt="Reduce button" title="Reduce" />
			</Banner>
			<DiscussionInterface />
			<TextInput />
		</Style>
	)
}

export default ChatWindow