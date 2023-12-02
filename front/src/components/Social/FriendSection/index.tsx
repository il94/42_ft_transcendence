import {
	useContext,
	useRef,
	RefObject,
	MouseEvent,
	Dispatch,
	SetStateAction
} from "react"

import {
	Style,
	ProfileName,
	Avatar,
	ProfileInfo,
	ProfileStatus
} from "./style"

import CardContext from "../../../contexts/CardContext"

type PropsFriendSection = {
	id: number,
	username: string,
	avatar: string,
	status: string,
	social: boolean,
	color: string,
	displayContextualMenu: Dispatch<SetStateAction<boolean>>,
	setContextualMenuPosition: Dispatch<SetStateAction<{
		top: number,
		left: number
	}>>
}

function FriendSection({ id, username, avatar, status, social, color, displayContextualMenu, setContextualMenuPosition }: PropsFriendSection) {

	const { card, displayCard, setCardPosition, cardIdTarget, setIdTargetCard } = useContext(CardContext)!
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

			const topMax = heightParentElement - 371 // taille de la carte

			const target = topCurrentElement - topParentElement
			const topCard = target > topMax ? topMax : target // s'assure que la carte ne sorte pas de l'écran si elle est trop basse

			setIdTargetCard(id)
			setCardPosition({ top: topCard })

			displayCard(true)
		}
	}

	function showMenuContextual(event: MouseEvent<HTMLDivElement>) {

		const friendcontainer = friendContainerRef.current

		if (friendcontainer) {
			const { bottom: bottomParentElement } = friendcontainer.parentElement!.getBoundingClientRect()

			const topMax = bottomParentElement - 175 // taille du menu
			const target = event.clientY
	
			const topMenu = target > topMax ? topMax : target // s'assure que la carte ne sorte pas de l'écran si elle est trop basse

			setContextualMenuPosition({ top: topMenu, left: event.clientX + 1 }) // +1 pour eviter que la souris soit directement sur le menu
			displayContextualMenu(true)
		}
	}

	function handleContextMenu(event: MouseEvent<HTMLDivElement>) {
		event.preventDefault();
	}

	return (
		<Style
			onClick={showCard}
			onAuxClick={showMenuContextual}
			onContextMenu={handleContextMenu}
			color={color} ref={friendContainerRef}>
			<Avatar src={avatar} />
			{
				!social &&
				<ProfileInfo>
					<ProfileName>
						{username}
					</ProfileName>
					<ProfileStatus>
						{status}
					</ProfileStatus>
				</ProfileInfo>
			}
		</Style>
		// const statusString = "ONLINE";
		// const statusEnum: Status = Status.valueOf(statusString as keyof typeof Status);
		// console.log(statusEnum); // Affichera 'ONLINE' si la chaîne correspond à une valeur de l'énumération
		
	)
}

export default FriendSection