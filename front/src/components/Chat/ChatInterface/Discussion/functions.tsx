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
	ErrorResponse,
	User,
	UserAuthenticate
} from "../../../../utils/types"
import axios, { AxiosError, AxiosResponse } from "axios"

type ShowCardProps = {
	displayCard: Dispatch<SetStateAction<boolean>>,
	setZCardIndex: Dispatch<SetStateAction<number>>,
	setCardPosition: Dispatch<SetStateAction<{
		left?: number,
		right?: number,
		top?: number,
		bottom?: number
	}>>,

	setUserTarget: Dispatch<SetStateAction<User | UserAuthenticate>>,

	url: string,
	token: string,

	displayPopupError: Dispatch<SetStateAction<{
		display: boolean,
		message?: string
	}>>,
	zMaxIndex: number,
	GameWrapperRef: any
}

export async function showCard(event: MouseEvent<HTMLDivElement | HTMLButtonElement>, userId: number, props: ShowCardProps) {
	try {
		const gameWrapperContainer = props.GameWrapperRef.current

		if (gameWrapperContainer) {

			const userResponse: AxiosResponse<User> = await axios.get(`http://${props.url}:3333/user/${userId}`, {
				headers: {
					'Authorization': `Bearer ${props.token}`
				}
			})

			props.setUserTarget({
				...userResponse.data,
				avatar: `http://${props.url}:3333/uploads/users/${userResponse.data.id}_`,
			})

			const heightCard = 390 // height de la carte
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
	catch (error) {
		if (axios.isAxiosError(error)) {
			const axiosError = error as AxiosError<ErrorResponse>
			const { statusCode, message } = axiosError.response?.data!
			if (statusCode === 403 || statusCode === 404)
				props.displayPopupError({ display: true, message: message })
			else
				props.displayPopupError({ display: true })
		}
		else
			props.displayPopupError({ display: true })
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
	displayCard: Dispatch<SetStateAction<boolean>>,

	userAuthenticate: UserAuthenticate,
	userTarget: User | UserAuthenticate,
	setUserTarget: Dispatch<SetStateAction<User | UserAuthenticate>>,
	channelTarget: Channel | undefined,

	url: string,
	token: string,

	displayPopupError: Dispatch<SetStateAction<{
		display: boolean,
		message?: string
	}>>,
	GameWrapperRef: any,
}

export async function showContextualMenu(event: MouseEvent<HTMLDivElement | HTMLButtonElement>, userId: number, props: ShowContextualMenuProps) {
	try {
		const gameWrapperContainer = props.GameWrapperRef.current

		if (gameWrapperContainer && props.channelTarget) {

			const userResponse: AxiosResponse<User> = await axios.get(`http://${props.url}:3333/user/${userId}`, {
				headers: {
					'Authorization': `Bearer ${props.token}`
				}
			})

			props.setUserTarget({
				...userResponse.data,
				avatar: `http://${props.url}:3333/uploads/users/${userResponse.data.id}_`,
			})

			const heightContextualMenu = await getContextualMenuHeight(contextualMenuStatus.CHAT, userResponse.data, props.userAuthenticate, props.channelTarget) // height du menu contextuel du chat
			const { height: GameWrapperHeight } = gameWrapperContainer.getBoundingClientRect() // height de la fenetre de jeu
			const horizontalBorder = window.innerHeight - GameWrapperHeight // height des bordures horizontales autour du jeu
			const maxBottom = window.innerHeight - horizontalBorder - heightContextualMenu // valeur max avant que le menu ne depasse par le bas

			const resultX = window.innerWidth - event.clientX // resultat horizontal par defaut (position du clic)
			let resultY = event.clientY // resultat vertical par defaut (position du clic)

			if (event.clientY - horizontalBorder / 2 > maxBottom) // verifie si le menu depasse sur l'axe vertical
				resultY -= event.clientY - horizontalBorder / 2 - maxBottom // ajuste le resultat vertical

			props.setContextualMenuPosition({ right: resultX, top: resultY })
			props.displayContextualMenu({ display: true, type: contextualMenuStatus.CHAT })
			props.displayCard(false)
		}
	}
	catch (error) {
		if (axios.isAxiosError(error)) {
			const axiosError = error as AxiosError<ErrorResponse>
			const { statusCode, message } = axiosError.response?.data!
			if (statusCode === 403 || statusCode === 404)
				props.displayPopupError({ display: true, message: message })
			else
				props.displayPopupError({ display: true })
		}
		else
			props.displayPopupError({ display: true })
	}
}

type handleClickChallengeStatusProps = {
	userAuthenticate: UserAuthenticate,
	displayPopupError: Dispatch<SetStateAction<{
		display: boolean,
		message?: string
	}>>,

	token: string,
	url: string,
}

export async function handleClickChallengeStatus(status : challengeStatus, idMsg: number, idChan : number, props: handleClickChallengeStatusProps) {
	try {
		await axios.patch(`http://${props.url}:3333/channel/${idChan}/message/${idMsg}`, {
			newStatus : status
		},
		{
			headers: {
				'Authorization': `Bearer ${props.token}`
			}
		})
	}
	catch (error) {
		if (axios.isAxiosError(error)) {
			const axiosError = error as AxiosError<ErrorResponse>
			const { statusCode, message } = axiosError.response?.data!
			if (statusCode === 403 || statusCode === 404)
				props.displayPopupError({ display: true, message: message })
			else
				props.displayPopupError({ display: true })
		}
		else
			props.displayPopupError({ display: true })
	}
}
