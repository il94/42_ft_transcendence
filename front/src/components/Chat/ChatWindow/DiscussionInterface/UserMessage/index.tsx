import { Style, Text } from "./style"

function UserMessage({ content } : { content: string }) {
	return (
		<Style className="userMessages">
			<Text>
				{(content)}
			</Text>
		</Style>
	)
}

export default UserMessage