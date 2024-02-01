import {
	Dispatch,
	MouseEvent,
	SetStateAction
} from "react"

import {
	getContextualMenuHeight
} from "../../../../utils/functions"

import {
	challengeStatus,
	contextualMenuStatus
} from "../../../../utils/status"

import {
	Channel,
	User,
	UserAuthenticate
} from "../../../../utils/types"
import axios from "axios"

type ShowCardProps = {
	displayCard: Dispatch<SetStateAction<boolean>>,
	setZCardIndex: Dispatch<SetStateAction<number>>,
	setCardPosition: Dispatch<SetStateAction<{
		left?: number,
		right?: number,
		top?: number,
		bottom?: number
	}>>,

	zMaxIndex: number,

	setUserTarget: Dispatch<SetStateAction<User | UserAuthenticate>>,

	GameWrapperRef: any
}

export function showCard(event: MouseEvent<HTMLDivElement>, sender: User, props: ShowCardProps) {

	const gameWrapperContainer = props.GameWrapperRef.current

	if (gameWrapperContainer) {
		props.setUserTarget(sender)

		const heightCard = 371 // height de la carte
		const { height: GameWrapperHeight, width: GameWrapperWidth } = gameWrapperContainer.getBoundingClientRect() // dimensions de la fenetre de jeu
		const horizontalBorder = window.innerHeight - GameWrapperHeight // height des bordures horizontales autour du jeu
		const verticalBorder = window.innerWidth - GameWrapperWidth // height des bordures verticales autour du jeu
		const heightNavBar = 53 // height de la barre de navigation (logo, info, profil)

		const resultX = window.innerWidth - event.clientX - verticalBorder / 2 // resultat horizontal par defaut (taille de la fenetre - position du clic - bordure de droite)
		const resultY = event.clientY - heightCard - horizontalBorder / 2 - heightNavBar // resultat vertical par defaut (position du clic - height de la carte - bordure du haut - navbar)

		props.setCardPosition({ right: resultX, top: resultY })
		props.setZCardIndex(props.zMaxIndex + 1)
		props.displayCard(true)
	}
}

type ShowContextualMenuProps = {
	setContextualMenuPosition: Dispatch<SetStateAction<{
		left?: number,
		right?: number,
		top?: number,
		bottom?: number
	}>>,
	displayContextualMenu: Dispatch<SetStateAction<{
		display: boolean,
		type: contextualMenuStatus | undefined
	}>>,

	userAuthenticate: UserAuthenticate,
	userTarget: User | UserAuthenticate,
	setUserTarget: Dispatch<SetStateAction<User | UserAuthenticate>>,
	channelTarget: Channel | undefined,

	GameWrapperRef: any,
}

export async function showContextualMenu(event: MouseEvent<HTMLDivElement>, sender: User, props: ShowContextualMenuProps) {

	const gameWrapperContainer = props.GameWrapperRef.current

	if (gameWrapperContainer && props.channelTarget) {

		props.setUserTarget(sender)

		const heightContextualMenu = await getContextualMenuHeight(contextualMenuStatus.CHAT, props.userTarget, props.userAuthenticate, props.channelTarget) // height du menu contextuel du chat
		const { height: GameWrapperHeight } = gameWrapperContainer.getBoundingClientRect() // height de la fenetre de jeu
		const horizontalBorder = window.innerHeight - GameWrapperHeight // height des bordures horizontales autour du jeu
		const maxBottom = window.innerHeight - horizontalBorder - heightContextualMenu // valeur max avant que le menu ne depasse par le bas

		const resultX = window.innerWidth - event.clientX // resultat horizontal par defaut (position du clic)
		let resultY = event.clientY // resultat vertical par defaut (position du clic)

		if (event.clientY - horizontalBorder / 2 > maxBottom) // verifie si le menu depasse sur l'axe vertical
			resultY -= event.clientY - horizontalBorder / 2 - maxBottom // ajuste le resultat vertical

		props.setContextualMenuPosition({ right: resultX, top: resultY })
		props.displayContextualMenu({ display: true, type: contextualMenuStatus.CHAT })
	}
}

type handleClickChallengeStatusProps = {
	userAuthenticate: UserAuthenticate,

	token: string,
	url: string,
}

export async function handleClickChallengeStatus(status : challengeStatus, idMsg: number, idChan : number, props: handleClickChallengeStatusProps) {
	const sockets = await axios.get(`http://${props.url}:3333/channel/${idChan}/sockets`, {
			headers: {
					'Authorization': `Bearer ${props.token}`
				} 
			})
	await axios.patch(`http://${props.url}:3333/channel/message/${idMsg}`, 
	{ idMsg: idMsg , msgStatus : status},
	{
	headers: {
		'Authorization': `Bearer ${props.token}`
			}
		}
	);
	props.userAuthenticate.socket?.emit('updateChallenge', sockets.data, idMsg, status, idChan);
}
