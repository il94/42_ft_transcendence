import { MouseEvent, useContext } from "react"

import {
	Avatar,
	Style,
	UserName,
	Text,
	MessageContent
} from "./style"

import ContextualMenuContext from "../../../../../contexts/ContextualMenuContext"
import CardContext from "../../../../../contexts/CardContext"
import DisplayContext from "../../../../../contexts/DisplayContext"
import InteractionContext from "../../../../../contexts/InteractionContext"

import { User } from "../../../../../utils/types"
import { userStatus } from "../../../../../utils/status"

type PropsContactText = {
	sender: User,
	content: string
}

function ContactText({ sender, content }: PropsContactText) {

	const { displayContextualMenu, setContextualMenuPosition } = useContext(ContextualMenuContext)!
	const { displayCard, setCardPosition } = useContext(CardContext)!
	const { setZCardIndex, zChatIndex, GameWrapperRef } = useContext(DisplayContext)!
	const { userTarget, setUserTarget, userAuthenticate, channelTarget } = useContext(InteractionContext)!

	function showCard(event: MouseEvent<HTMLDivElement>) {

		const GameWrapperContainer = GameWrapperRef.current

		if (GameWrapperContainer) {
			setUserTarget(sender)

			const heightCard = 371 // height de la carte
			const { height: GameWrapperHeight, width: GameWrapperWidth } = GameWrapperContainer.getBoundingClientRect() // dimensions de la fenetre de jeu
			const horizontalBorder = window.innerHeight - GameWrapperHeight // height des bordures horizontales autour du jeu
			const verticalBorder = window.innerWidth - GameWrapperWidth // height des bordures verticales autour du jeu
			const heightNavBar = 53 // height de la barre de navigation (logo, info, profil)

			const resultX = window.innerWidth - event.clientX - verticalBorder / 2 // resultat horizontal par defaut (taille de la fenetre - position du clic - bordure de droite)
			const resultY = event.clientY - heightCard - horizontalBorder / 2 - heightNavBar // resultat vertical par defaut (position du clic - height de la carte - bordure du haut - navbar)

			setCardPosition({ right: resultX, top: resultY })
			setZCardIndex(zChatIndex + 1)
			displayCard(true)
		}
	}

	function showContextualMenu(event: MouseEvent<HTMLDivElement>) {

		const GameWrapperContainer = GameWrapperRef.current

		if (GameWrapperContainer) {
			function getContextualMenuHeight() { // determine la taille du menu par rapport aux status du user authentifie et de la cible
				if (channelTarget) {
					if (channelTarget.owner === userAuthenticate) {
						if (userTarget.status === userStatus.OFFLINE)
							return (280)
						else
							return (315)
					}
					else if (channelTarget.administrators.includes(userAuthenticate) &&
						(channelTarget.owner !== userTarget &&
							!channelTarget.administrators.includes(userTarget)))
						return (280)
					else
						return (175)
				}
				else
					return (0)
			}

			setUserTarget(sender)

			const heightContextualMenu = getContextualMenuHeight() // height du menu contextuel du chat
			const { height: GameWrapperHeight } = GameWrapperContainer.getBoundingClientRect() // height de la fenetre de jeu
			const horizontalBorder = window.innerHeight - GameWrapperHeight // height des bordures horizontales autour du jeu
			const maxBottom = window.innerHeight - horizontalBorder - heightContextualMenu // valeur max avant que le menu ne depasse par le bas

			const resultX = window.innerWidth - event.clientX // resultat horizontal par defaut (position du clic)
			let resultY = event.clientY // resultat vertical par defaut (position du clic)

			if (event.clientY - horizontalBorder / 2 > maxBottom) // verifie si le menu depasse sur l'axe vertical
				resultY -= event.clientY - horizontalBorder / 2 - maxBottom // ajuste le resultat vertical


			setContextualMenuPosition({ right: resultX, top: resultY })
			displayContextualMenu({ display: true, type: "chat" })
		}
	}

	return (
		<Style>
			<Avatar
				src={sender.avatar}
				onClick={showCard}
				onAuxClick={showContextualMenu} />
			<MessageContent>
				<UserName>
					{sender.username}
				</UserName>
				<Text>
					{content}
				</Text>
			</MessageContent>
		</Style>
	)
}

export default ContactText