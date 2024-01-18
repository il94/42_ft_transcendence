import { MouseEvent, useContext, useState } from "react"

import {
	Avatar,
	Style,
	Text,
	InvitationContent,
	ButtonsWrapper
} from "./style"

import ButtonChallenge from "../../../../../componentsLibrary/ButtonChallenge"

import ContextualMenuContext from "../../../../../contexts/ContextualMenuContext"
import CardContext from "../../../../../contexts/CardContext"
import DisplayContext from "../../../../../contexts/DisplayContext"
import InteractionContext from "../../../../../contexts/InteractionContext"

import { challengeStatus, contextualMenuStatus, userStatus } from "../../../../../utils/status"
import { User, UserAuthenticate } from "../../../../../utils/types"

import colors from "../../../../../utils/colors"

type PropsContactInvitation = {
	sender: User,
	target: User | UserAuthenticate,
	initialStatus: challengeStatus
}

function ContactInvitation({ sender, target, initialStatus }: PropsContactInvitation) {

	const { displayContextualMenu, setContextualMenuPosition } = useContext(ContextualMenuContext)!
	const { displayCard, setCardPosition } = useContext(CardContext)!
	const { setZCardIndex, zMaxIndex, GameWrapperRef } = useContext(DisplayContext)!
	const { userTarget, setUserTarget, userAuthenticate, channelTarget } = useContext(InteractionContext)!

	function showCard(event: MouseEvent<HTMLDivElement>) {

		const gameWrapperContainer = GameWrapperRef.current

		if (gameWrapperContainer) {
			setUserTarget(sender)

			const heightCard = 371 // height de la carte
			const { height: GameWrapperHeight, width: GameWrapperWidth } = gameWrapperContainer.getBoundingClientRect() // dimensions de la fenetre de jeu
			const horizontalBorder = window.innerHeight - GameWrapperHeight // height des bordures horizontales autour du jeu
			const verticalBorder = window.innerWidth - GameWrapperWidth // height des bordures verticales autour du jeu
			const heightNavBar = 53 // height de la barre de navigation (logo, info, profil)

			const resultX = window.innerWidth - event.clientX - verticalBorder / 2 // resultat horizontal par defaut (taille de la fenetre - position du clic - bordure de droite)
			const resultY = event.clientY - heightCard - horizontalBorder / 2 - heightNavBar // resultat vertical par defaut (position du clic - height de la carte - bordure du haut - navbar)

			setCardPosition({ right: resultX, top: resultY })
			setZCardIndex(zMaxIndex + 1)
			displayCard(true)
		}
	}

	function showContextualMenu(event: MouseEvent<HTMLDivElement>) {

		const gameWrapperContainer = GameWrapperRef.current

		if (gameWrapperContainer) {
			function getContextualMenuHeight() { // determine la taille du menu par rapport aux status du user authentifie et de la cible
				if (channelTarget) {
					if (channelTarget.owner?.id === userAuthenticate.id) {
						if (userTarget.status === userStatus.OFFLINE)
							return (280)
						else
							return (315)
					}
					else if (channelTarget.administrators.some((administrator) => administrator.id === userAuthenticate.id) &&
						(channelTarget.owner?.id !== userTarget.id &&
						!channelTarget.administrators.some((administrator) => administrator.id === userTarget.id)))
						return (280)
					else
						return (175)
				}
				else
					return (0)
			}

			setUserTarget(sender)

			const heightContextualMenu = getContextualMenuHeight() // height du menu contextuel du chat
			const { height: GameWrapperHeight } = gameWrapperContainer.getBoundingClientRect() // height de la fenetre de jeu
			const horizontalBorder = window.innerHeight - GameWrapperHeight // height des bordures horizontales autour du jeu
			const maxBottom = window.innerHeight - horizontalBorder - heightContextualMenu // valeur max avant que le menu ne depasse par le bas

			const resultX = window.innerWidth - event.clientX // resultat horizontal par defaut (position du clic)
			let resultY = event.clientY // resultat vertical par defaut (position du clic)

			if (event.clientY - horizontalBorder / 2 > maxBottom) // verifie si le menu depasse sur l'axe vertical
				resultY -= event.clientY - horizontalBorder / 2 - maxBottom // ajuste le resultat vertical

			setContextualMenuPosition({ right: resultX, top: resultY })
			displayContextualMenu({ display: true, type: contextualMenuStatus.CHAT })
		}
	}

	const [status, setStatus] = useState<challengeStatus>(initialStatus)

	return (
		<Style>
			<Avatar
				src={sender.avatar}
				onClick={showCard}
				onAuxClick={showContextualMenu} />
			<InvitationContent>
				<Text>
					{sender.username} challenge {target.username} to a duel !
				</Text>
				{
					status === challengeStatus.PENDING &&
					<ButtonsWrapper>
						<ButtonChallenge
							onClick={() => setStatus(challengeStatus.ACCEPTED)}
							color={colors.buttonGreen}>
							Accept
						</ButtonChallenge>
						<ButtonChallenge
							onClick={() => setStatus(challengeStatus.CANCELLED)}
							color={colors.buttonRed}>
							Decline
						</ButtonChallenge>
					</ButtonsWrapper>
				}
				{
					status === challengeStatus.ACCEPTED &&
					<ButtonsWrapper>
						<ButtonChallenge
							color={colors.buttonGreen}>
							Accepted !
						</ButtonChallenge>
					</ButtonsWrapper>
				}
				{
					status === challengeStatus.CANCELLED &&
					<ButtonsWrapper>
						<ButtonChallenge
							color={colors.buttonGray}>
							Cancelled
						</ButtonChallenge>
					</ButtonsWrapper>
				}
				{
					status === challengeStatus.IN_PROGRESS &&
					<ButtonsWrapper>
						<ButtonChallenge
							color={colors.button}>
							Spectate
						</ButtonChallenge>
					</ButtonsWrapper>
				}
				{
					status === challengeStatus.FINISHED &&
					<ButtonsWrapper>
						<ButtonChallenge
							color={colors.button}>
							Finished
						</ButtonChallenge>
					</ButtonsWrapper>
				}
			</InvitationContent>
		</Style>
	)
}

export default ContactInvitation