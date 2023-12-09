import { Style, Text } from "./style"

type PropsUserMessage = {
	content: string
}

function UserMessage({ content } : PropsUserMessage) {
	return (
		<Style className="userMessages">
			<Text>
				{(content)}
			</Text>
		</Style>
	)
}

export default UserMessage