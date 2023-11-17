import { RefObject, useContext, useRef } from "react"
import { Style, ProfilePicture } from "./style"
import { CardContext } from "../../../../pages/Game"

function FriendReduce({ color } : { color: string }) {

	const { displayCard, setCardPosition } = useContext(CardContext)!
	const friendContainerRef : RefObject<HTMLElement> = useRef(null)

	function showCard() {
		
		const friendcontainer = friendContainerRef.current

		if (friendcontainer)
		{
			const topCurrentElement = friendcontainer.getBoundingClientRect().top
			const { top: topParentElement, height: heightParentElement } = friendcontainer.parentElement!.getBoundingClientRect()
			
			const topMax = heightParentElement - 371 // taille de la carte
	
			const topCard = topCurrentElement - topParentElement > topMax ? topMax : topCurrentElement - topParentElement // s'assure que la carte ne sorte pas de l'écran si elle est trop basse
		
			setCardPosition(topCard)
			displayCard(true)
		}
		
	}

	return (
		<Style onClick={showCard} color={color} ref={friendContainerRef}>
			<ProfilePicture />
		</Style>
	)
}

export default FriendReduce