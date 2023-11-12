import { Banner, ChannelName, ChatWindow, ContactList, DiscussionInterface, ReduceButton, Style } from "./style"
import ReduceIcon from "../../assets/reduce.png"

function Chat({ displayChat } : { displayChat: React.Dispatch<React.SetStateAction<boolean>>}) {
	return (
		<Style>
			<ContactList />
			<ChatWindow>
				<Banner>
					<ChannelName>
						Channel 1
					</ChannelName>
					<ReduceButton src={ReduceIcon} onClick={() => displayChat(false)}
									alt="Reduce button" title="Reduce" />
				</Banner>
				<DiscussionInterface />
			</ChatWindow>
		</Style>
	)
}

export default Chat