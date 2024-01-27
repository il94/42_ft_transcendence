import {
	Style,
	Text
} from "./style"

type PropsUserText = {
	content: string
}

function UserText({ content }: PropsUserText) {
	return (
		<Style className="UserTexts">
			<Text>
				{(content)}
			</Text>
		</Style>
	)
}

export default UserText