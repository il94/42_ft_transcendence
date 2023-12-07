import { MouseEvent, useContext } from "react"
import {
	Avatar,
	Style,
	UserName,
	Text,
	MessageContent
} from "./style"
import ContextualMenuContext from "../../../../../contexts/ContextualMenuContext"

type PropsContactMessage = {
	userName: string,
	content: string
}

function ContactMessage({ userName, content } : PropsContactMessage ) {

	const { displayContextualMenu, setContextualMenuPosition } = useContext(ContextualMenuContext)!

	function showContextualMenu(event: MouseEvent<HTMLDivElement>) {

		const resultX = window.innerWidth - event.clientX
		const resultY = window.innerHeight - event.clientY

		setContextualMenuPosition({ right: resultX, bottom: resultY })
		displayContextualMenu(true)
		
	}

	return (
		<Style>
			<Avatar onAuxClick={showContextualMenu} />
			<MessageContent>
				<UserName>
					{userName}
				</UserName>
				<Text>
					{content}
				</Text>
			</MessageContent>
		</Style>
	)
}

export default ContactMessage