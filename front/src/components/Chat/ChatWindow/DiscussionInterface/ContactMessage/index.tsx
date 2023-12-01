import { MouseEvent, useContext } from "react"
import {
	ProfilePicture,
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

		const parentElementContainer = (event.target as HTMLElement).parentElement!.parentElement!.parentElement!.parentElement!.parentElement!
		const { bottom: bottomParentElement } = parentElementContainer.getBoundingClientRect()


		const topMax = bottomParentElement - 175 // taille du menu
		const target = event.clientY

		const topMenu = target > topMax ? topMax : target // s'assure que la carte ne sorte pas de l'écran si elle est trop basse

		setContextualMenuPosition({ top: topMenu, left: event.clientX + 1 }) // +1 pour eviter que la souris soit directement sur le menu
		displayContextualMenu(true)

	}

	return (
		<Style>
			<ProfilePicture onAuxClick={showContextualMenu} />
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