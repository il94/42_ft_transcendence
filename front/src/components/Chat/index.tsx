import {
	Banner,
	ChannelName,
	ChatWindow,
	DiscussionInterface,
	ReduceButton,
	Style
} from "./style"

import TextInput from "./TextInput"
import ContactList from "./ContactList"

import ReduceIcon from "../../assets/reduce.png"

function Chat({ displayChat }: { displayChat: React.Dispatch<React.SetStateAction<boolean>> }) {
	return (
		<Style>
			<ContactList />
			<ChatWindow>
				<Banner>
					<ChannelName>
						Example
					</ChannelName>
					<ReduceButton src={ReduceIcon} onClick={() => displayChat(false)}
						alt="Reduce button" title="Reduce" />
				</Banner>
				<DiscussionInterface />
				<TextInput />
			</ChatWindow>
		</Style>
	)
}

export default Chat