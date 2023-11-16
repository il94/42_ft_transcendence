import { useContext } from "react"

import {
	Style,
	ProfileName,
	ProfilePicture,
	ProfileInfo,
	ProfileStatus
} from "./style"

import { CardContext } from "../../../pages/Game" 


function Friend({ color } : { color: string }) {

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
			<ProfileInfo onClick={(event) => {showCard(event.target.parentElement); event.stopPropagation()}}>
				<ProfileName onClick={(event) => {showCard(event.target.parentElement.parentElement); event.stopPropagation()}}>
					Example
				</ProfileName>
				<ProfileStatus onClick={(event) => {showCard(event.target.parentElement.parentElement); event.stopPropagation()}}>
					En recherche de partie...
				</ProfileStatus>
			</ProfileInfo>
		</Style>
	)
}

export default Friend