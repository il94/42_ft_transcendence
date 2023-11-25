import { useContext, useRef, RefObject, MouseEvent } from "react"

import {
	Style,
	ProfileName,
	ProfilePicture,
	ProfileInfo,
	ProfileStatus
} from "./style"

import CardContext from "../../../contexts/CardContext"
import ZIndexContext from "../../../contexts/ZIndexContext"

function Friend({ username, social, color } : { username: string, social: boolean, color: string }) {

	const { card, displayCard, setCardPosition, cardUsername, setCardUserName } = useContext(CardContext)!
	const { zChatIndex, setZCardIndex } = useContext(ZIndexContext)!
	const friendContainerRef : RefObject<HTMLElement> = useRef(null)

	function showCard() {
		
		if (cardUsername === username)
		{
			displayCard(!card)
			return ;
		}

		const friendcontainer = friendContainerRef.current

		if (friendcontainer)
		{
			const topCurrentElement = friendcontainer.getBoundingClientRect().top
			const { top: topParentElement, height: heightParentElement } = friendcontainer.parentElement!.getBoundingClientRect()
			
			const topMax = heightParentElement - 388 // taille de la carte 371 + margin de la scroll bar 17
	
			const target = topCurrentElement - topParentElement
			const topCard = target > topMax ? topMax : target // s'assure que la carte ne sorte pas de l'écran si elle est trop basse
		
			setCardUserName(username)
			setCardPosition({ top: topCard, left: 0})
			setZCardIndex(zChatIndex + 1)

			displayCard(true)
		}

	}

	function handleContextMenu(event: MouseEvent<HTMLDivElement>) {
		event.preventDefault();
	}

	return (
		<Style onClick={showCard}
				onAuxClick={() => console.log("LOL")}
				onContextMenu={handleContextMenu}
				color={color} ref={friendContainerRef}>
			<ProfilePicture />
			{
				!social &&
			<ProfileInfo>
				<ProfileName>
					{username}
				</ProfileName>
				<ProfileStatus>
					En recherche de partie...
				</ProfileStatus>
			</ProfileInfo>
			}

		</Style>
	)
}

export default Friend