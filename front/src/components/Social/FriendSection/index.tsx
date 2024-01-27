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
import InteractionContext from "../../../contexts/InteractionContext"
import DisplayContext from "../../../contexts/DisplayContext"

import { capitalize, getContextualMenuHeight } from "../../../utils/functions"

import { User } from "../../../utils/types"
import { contextualMenuStatus, userStatus } from "../../../utils/status"

type PropsFriendSection = {
	friend: User,
	backgroundColor: string,
	social: boolean,
	displayContextualMenu: Dispatch<SetStateAction<{
		display: boolean,
		type: contextualMenuStatus | undefined
	}>>,
	setContextualMenuPosition: Dispatch<SetStateAction<{
		left?: number,
		top?: number,
		bottom?: number
	}>>
}

function FriendSection({ friend, backgroundColor, social, displayContextualMenu, setContextualMenuPosition }: PropsFriendSection) {

	const { userTarget, setUserTarget, userAuthenticate } = useContext(InteractionContext)!
	const { card, displayCard, setCardPosition } = useContext(CardContext)!
	const { setZCardIndex, zMaxIndex, GameWrapperRef } = useContext(DisplayContext)!
	const friendContainerRef: RefObject<HTMLElement> = useRef(null)

	function showCard() {
		if (card && userTarget === friend) // verifie que la carte a afficher ne l'est pas deja
		{
			displayCard(false)
			return;
		}

		const friendContainer: HTMLElement | null = friendContainerRef.current // sert a cibler le container et non ses enfants
		const gameWrapperContainer: HTMLElement | null = GameWrapperRef.current

		if (friendContainer && gameWrapperContainer) {
			setUserTarget(friend)

			const heightCard = 371 // height de la carte
			const horizontalBorder = window.innerHeight - gameWrapperContainer.getBoundingClientRect().height // height des bordures horizontales autour du jeu
			const heightNavBar = 53 // height de la barre de navigation (logo, info, profil)
			const maxBottom = window.innerHeight - horizontalBorder - heightNavBar - heightCard // valeur max avant que la carte ne depasse par le bas

			let resultY = friendContainer.getBoundingClientRect().top - horizontalBorder / 2 - heightNavBar // resultat par defaut (top container cible - bordure du haut - navbar)

			if (resultY > maxBottom) // verifie si la carte depasse sur l'axe vertical
				resultY = maxBottom // ajuste le resultat vertical

			setZCardIndex(zMaxIndex + 1)
			setCardPosition({ top: resultY })
			displayCard(true)
		}
	}

	async function showContextualMenu(event: MouseEvent<HTMLDivElement>) {

		setUserTarget(friend)

		const heightContextualMenu = await getContextualMenuHeight(contextualMenuStatus.SOCIAL, userTarget, userAuthenticate) // height du menu contextuel de la liste d'amis
		const horizontalBorder = window.innerHeight * 5 / 100 // height des bordures horizontales autour du jeu
		const maxBottom = window.innerHeight - horizontalBorder - heightContextualMenu // valeur max avant que le menu ne depasse par le bas

		const resultX = event.clientX // resultat horizontal par defaut (position du clic)
		let resultY = event.clientY // resultat vertical par defaut (position du clic)

		if (event.clientY - horizontalBorder / 2 > maxBottom) // verifie si le menu depasse sur l'axe vertical
			resultY -= event.clientY - horizontalBorder / 2 - maxBottom // ajuste le resultat vertical

		setContextualMenuPosition({ left: resultX, top: resultY })
		displayContextualMenu({ display: true, type: contextualMenuStatus.SOCIAL })
	}

	function handleContextMenu(event: MouseEvent<HTMLDivElement>) {
		event.preventDefault();
	}

	const isBlocked = userAuthenticate.blockedUsers.some((blockedUsers) => blockedUsers.id === friend.id)

	return (
		<Style
			onClick={showCard}
			onAuxClick={showContextualMenu}
			onContextMenu={handleContextMenu}
			$backgroundColor={backgroundColor}
			$isBlocked={isBlocked}
			ref={friendContainerRef}>
			<Avatar src={friend.avatar} />
			{
				!social &&
				<ProfileInfo $offline={friend.status === userStatus.OFFLINE}>
					<ProfileName>
						{friend.username}
					</ProfileName>
					<ProfileStatus>
						{capitalize(friend.status)}
					</ProfileStatus>
				</ProfileInfo>
			}
		</Style>
	)
}

export default FriendSection