import {
	Message,
	Style
} from "./style"

type PropsLog = {
	content: string
}

function Log({ content }: PropsLog) {

	return (
		<Style>
			<Message>
				{content}
			</Message>
		</Style>
			
	)
}

export default Log