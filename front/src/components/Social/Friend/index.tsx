import { useContext, useRef, RefObject } from "react"

import {
	Style,
	ProfileName,
	ProfilePicture,
	ProfileInfo,
	ProfileStatus
} from "./style"

import CardContext from "../../../contexts/CardContext"
import ZIndexContext from "../../../contexts/ZIndexContext"

function Friend({ social, color } : { social: boolean, color: string }) {

	const { displayCard, setCardPosition } = useContext(CardContext)!
	const { zChatIndex, setZCardIndex } = useContext(ZIndexContext)!
	const friendContainerRef : RefObject<HTMLElement> = useRef(null)

	function showCard() {
		
		const friendcontainer = friendContainerRef.current

		if (friendcontainer)
		{
			const topCurrentElement = friendcontainer.getBoundingClientRect().top
			const { top: topParentElement, height: heightParentElement } = friendcontainer.parentElement!.getBoundingClientRect()
			
			const topMax = heightParentElement - 371 // taille de la carte
	
			const topCard = topCurrentElement - topParentElement > topMax ? topMax : topCurrentElement - topParentElement // s'assure que la carte ne sorte pas de l'écran si elle est trop basse
		
			setCardPosition({ top: topCard, left: 0})
			setZCardIndex(zChatIndex - 1)

			displayCard(true)
		}
		
	}

	return (
		<Style onClick={showCard} color={color} ref={friendContainerRef}>
			<ProfilePicture />
			{
				!social &&
			<ProfileInfo>
				<ProfileName>
					WWWWWWWW
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