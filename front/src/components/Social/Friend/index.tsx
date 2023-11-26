import {
	useContext,
	useRef,
	RefObject,
	MouseEvent
} from "react"

import {
	Style,
	ProfileName,
	ProfilePicture,
	ProfileInfo,
	ProfileStatus
} from "./style"

import CardContext from "../../../contexts/CardContext"
import ZIndexContext from "../../../contexts/ZIndexContext"
import MenuContextualContext from "../../../contexts/MenuContextualContext"

type PropsFriend = {
	id: number,
	username: string,
	profilePicture: string,
	state: string,
	social: boolean,
	color: string
}

function Friend({ id, username, profilePicture, state, social, color }: PropsFriend) {

	const { card, displayCard, setCardPosition, cardIdTarget, setIdTargetCard } = useContext(CardContext)!
	const { displayMenuContextual, setMenuContextualPosition } = useContext(MenuContextualContext)!
	const { zChatIndex, setZCardIndex } = useContext(ZIndexContext)!
	const friendContainerRef: RefObject<HTMLElement> = useRef(null)

	function showCard() {

		if (card && cardIdTarget === id) {
			displayCard(false)
			return;
		}

		const friendcontainer = friendContainerRef.current

		if (friendcontainer) {
			const topCurrentElement = friendcontainer.getBoundingClientRect().top
			const { top: topParentElement, height: heightParentElement } = friendcontainer.parentElement!.getBoundingClientRect()

			const topMax = heightParentElement - 388 // taille de la carte 371 + margin de la scroll bar 17

			const target = topCurrentElement - topParentElement
			const topCard = target > topMax ? topMax : target // s'assure que la carte ne sorte pas de l'écran si elle est trop basse

			setIdTargetCard(id)
			setCardPosition({ top: topCard.toString() + "px", left: "0px" })
			setZCardIndex(zChatIndex + 1)

			displayCard(true)
		}

	}

	function showMenuContextual(event: MouseEvent<HTMLDivElement>) {
		setMenuContextualPosition({ top: event.clientY, left: event.clientX }) // set la position du menu sur le clic
		displayMenuContextual(true)
	}

	function handleContextMenu(event: MouseEvent<HTMLDivElement>) {
		event.preventDefault();
	}

	return (
		<Style onClick={showCard}
			onAuxClick={showMenuContextual}
			onContextMenu={handleContextMenu}
			color={color} ref={friendContainerRef}>
			<ProfilePicture src={profilePicture} />
			{
				!social &&
				<ProfileInfo>
					<ProfileName>
						{username}
					</ProfileName>
					<ProfileStatus>
						{state}
					</ProfileStatus>
				</ProfileInfo>
			}
		</Style>
	)
}

export default Friend