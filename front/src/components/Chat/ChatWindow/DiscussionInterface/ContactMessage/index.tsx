import { ProfilePicture, Style, UserName, Text, MessageContent } from "./style"

type ContactProps = {
	userName: string,
	content: string
}

function ContactMessage({ userName, content } : ContactProps ) {
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

export default ContactMessage