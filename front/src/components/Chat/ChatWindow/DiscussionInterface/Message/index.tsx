import { ProfilePicture, Style, UserName, Text, MessageContent } from "./style"

function Message({ userName, content } : { userName: string, content: string }) {
	return (
		<Style>
			<ProfilePicture />
			<MessageContent>
				<UserName>
					{userName}
				</UserName>
				<Text>
					{(content)}
				</Text>
			</MessageContent>
		</Style>
	)
}

export default Message