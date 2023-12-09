import { MouseEvent, useContext } from "react"

import {
	Avatar,
	Style,
	Text,
	InvitationContent,
	ButtonsWrapper,
	Button
} from "./style"

import ContextualMenuContext from "../../../../../contexts/ContextualMenuContext"
import CardContext from "../../../../../contexts/CardContext"
import GlobalDisplayContext from "../../../../../contexts/GlobalDisplayContext"

import { challengeStatus } from "../../../../../utils/status"

import colors from "../../../../../utils/colors"

type PropsContactDuelInvitation = {
	userName: string,
	opponent: string,
	status: string
}

function ContactDuelInvitation({ userName, opponent, status } : PropsContactDuelInvitation) {
	
	const { displayContextualMenu, setContextualMenuPosition } = useContext(ContextualMenuContext)!
	const { displayCard, setCardPosition } = useContext(CardContext)!
	const { setZCardIndex, zChatIndex, GameWrapperRef } = useContext(GlobalDisplayContext)!

	function showCard(event: MouseEvent<HTMLDivElement>) {

		const GameWrapperContainer = GameWrapperRef.current

		if (GameWrapperContainer)
		{
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

		if (GameWrapperContainer)
		{
			// doit pouvoir donner la taille du menu en fonction des sections a afficher
			function getContextualMenuHeight() {
				return (210) // temporaire
			}
			
			const heightContextualMenu = getContextualMenuHeight() // height du menu contextuel
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
				onClick={showCard}
				onAuxClick={showContextualMenu} />
			<InvitationContent>
				<Text>
					{userName} challenge {opponent} to a duel !
				</Text>
				{
					status === challengeStatus.PENDING &&
					<ButtonsWrapper>
						<Button color={colors.buttonGreen}>
							Accept
						</Button>
						<Button color={colors.buttonRed}>
							Decline
						</Button>
					</ButtonsWrapper>
				}
				{
					status === challengeStatus.ACCEPTED &&
					<ButtonsWrapper>
						<Button color={colors.buttonGreen}>
							Accepted !
						</Button>
					</ButtonsWrapper>
				}
				{
					status === challengeStatus.CANCELLED &&
					<ButtonsWrapper>
						<Button color={colors.buttonGray}>
							Cancelled
						</Button>
					</ButtonsWrapper>
				}
				{
					status === challengeStatus.IN_PROGRESS &&
					<ButtonsWrapper>
						<Button color={colors.button}>
							Spectate
						</Button>
					</ButtonsWrapper>
				}
				{
					status === challengeStatus.FINISHED &&
					<ButtonsWrapper>
						<Button color={colors.button}>
							Finished
						</Button>
					</ButtonsWrapper>
				}
			</InvitationContent>
		</Style>
	)
}

export default ContactDuelInvitation