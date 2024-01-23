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

import { getContextualMenuHeight } from "../../../../../utils/functions"

import { challengeStatus, contextualMenuStatus, messageStatus } from "../../../../../utils/status"
import { MessageInvitation, User, UserAuthenticate } from "../../../../../utils/types"

import colors from "../../../../../utils/colors"
import axios from "axios"
import AuthContext from "../../../../../contexts/AuthContext"

type PropsContactInvitation = {
	sender: User,
	target: User | UserAuthenticate,
	initialStatus: challengeStatus,
	idMsg: number,
	idChan: number
}

function ContactInvitation({ sender, target, initialStatus, idMsg, idChan}: PropsContactInvitation) {

	const { displayContextualMenu, setContextualMenuPosition } = useContext(ContextualMenuContext)!
	const { displayCard, setCardPosition } = useContext(CardContext)!
	const { setZCardIndex, zMaxIndex, GameWrapperRef } = useContext(DisplayContext)!
	const { userTarget, setUserTarget, userAuthenticate, channelTarget } = useContext(InteractionContext)!
	const { token, url } = useContext(AuthContext)!
	
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

	async function showContextualMenu(event: MouseEvent<HTMLDivElement>) {

		const gameWrapperContainer = GameWrapperRef.current

		if (gameWrapperContainer && channelTarget) {

			setUserTarget(sender)

			const heightContextualMenu = await getContextualMenuHeight(contextualMenuStatus.CHAT, userTarget, userAuthenticate, channelTarget) // height du menu contextuel du chat
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

	async function handleClickChallengeStatus(status : challengeStatus, idMsg: number, idChan : number) {
		const sockets = await axios.get(`http://${url}:3333/channel/${idChan}/sockets`, {
				headers: {
						'Authorization': `Bearer ${token}`
					} 
				})
		await axios.patch(`http://${url}:3333/channel/message/${idMsg}`, 
		{ idMsg: idMsg , msgStatus : status},
		{
		headers: {
			'Authorization': `Bearer ${token}`
				}
			}
		);
		userAuthenticate.socket?.emit('updateChallenge', sockets.data, idMsg, status, idChan);
	}

	//const [status, setStatus] = useState<challengeStatus>(initialStatus)
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
					initialStatus === challengeStatus.PENDING && target.id === userAuthenticate.id &&
					<ButtonsWrapper>
						<ButtonChallenge
							onClick={() => handleClickChallengeStatus(challengeStatus.ACCEPTED, idMsg, idChan)}
							color={colors.buttonGreen}>
							Accept
						</ButtonChallenge>
						<ButtonChallenge
							onClick={() => handleClickChallengeStatus(challengeStatus.CANCELLED, idMsg, idChan)}
							color={colors.buttonRed}>
							Decline
						</ButtonChallenge>
					</ButtonsWrapper>
				}
				{
					initialStatus === challengeStatus.ACCEPTED &&
					<ButtonsWrapper>
						<ButtonChallenge
							color={colors.buttonGreen}>
							Accepted !
						</ButtonChallenge>
					</ButtonsWrapper>
				}
				{
					initialStatus === challengeStatus.CANCELLED &&
					<ButtonsWrapper>
						<ButtonChallenge
							color={colors.buttonGray}>
							Cancelled
						</ButtonChallenge>
					</ButtonsWrapper>
				}
				{
					initialStatus === challengeStatus.IN_PROGRESS &&
					<ButtonsWrapper>
						<ButtonChallenge
							color={colors.button}>
							Spectate
						</ButtonChallenge>
					</ButtonsWrapper>
				}
				{
					initialStatus === challengeStatus.FINISHED &&
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