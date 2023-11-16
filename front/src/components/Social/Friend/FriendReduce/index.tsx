import { useContext } from "react"
import { Style, ProfilePicture } from "./style"
import { CardContext } from "../../../../pages/Game"

function FriendReduce({ color } : { color: string }) {

	const { displayCard, setCardPosition } = useContext(CardContext)!

	function showCard(target: HTMLElement) {
		
		const topCurrentElement = target.getBoundingClientRect().top
		const { top: topParentElement, height: heightParentElement } = target.parentElement!.getBoundingClientRect()
		
		const topMax = heightParentElement - 371 // taille de la carte

		const topCard = topCurrentElement - topParentElement > topMax ? topMax : topCurrentElement - topParentElement // s'assure que la carte ne sorte pas de l'écran si elle est trop basse
	
		setCardPosition(topCard)
		displayCard(true)
	}

	return (
		<Style onClick={(event) => showCard(event.target)} color={color}>
			<ProfilePicture onClick={(event) => {showCard(event.target.parentElement); event.stopPropagation()}} />
		</Style>
	)
}

export default FriendReduce