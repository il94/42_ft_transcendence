import {
	ProfilePicture,
	Style,
	UserName,
	Text,
	MessageContent
} from "./style"

type PropsContactMessage = {
	userName: string,
	content: string
}

function ContactMessage({ userName, content } : PropsContactMessage ) {
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