import {
	useContext,
	useRef,
	RefObject,
	MouseEvent,
	Dispatch,
	SetStateAction
} from "react"
import axios, { AxiosError, AxiosResponse } from "axios"

import {
	Style,
	ProfileName,
	Avatar,
	ProfileInfo,
	ProfileStatus,
	Status
} from "./style"

import CardContext from "../../../contexts/CardContext"
import InteractionContext from "../../../contexts/InteractionContext"
import DisplayContext from "../../../contexts/DisplayContext"
import AuthContext from "../../../contexts/AuthContext"

import {
	capitalize,
	getContextualMenuHeight,
	userIsBlocked
} from "../../../utils/functions"

import {
	ErrorResponse,
	User
} from "../../../utils/types"

import {
	contextualMenuStatus,
	userStatus
} from "../../../utils/status"

type PropsFriendSection = {
	friend: User,
	social: boolean,
	displayContextualMenu: Dispatch<SetStateAction<{
		display: boolean,
		type: contextualMenuStatus | undefined
	}>>,
	setContextualMenuPosition: Dispatch<SetStateAction<{
		left?: number,
		top?: number,
		bottom?: number
	}>>,
	sectionIndex: number
}

function FriendSection({ friend, social, displayContextualMenu, setContextualMenuPosition, sectionIndex }: PropsFriendSection) {

	const { token, url } = useContext(AuthContext)!
	const { userTarget, setUserTarget, userAuthenticate } = useContext(InteractionContext)!
	const { card, displayCard, setCardPosition } = useContext(CardContext)!
	const { setZCardIndex, zMaxIndex, displayPopupError, GameWrapperRef } = useContext(DisplayContext)!
	
	const friendContainerRef: RefObject<HTMLElement> = useRef(null)

	async function showCard() {
		try {

			if (card && userTarget === friend) // verifie que la carte a afficher ne l'est pas deja
			{
				displayCard(false)
				return;
			}

			const friendContainer: HTMLElement | null = friendContainerRef.current // sert a cibler le container et non ses enfants
			const gameWrapperContainer: HTMLElement | null = GameWrapperRef.current

			if (friendContainer && gameWrapperContainer) {

				const userResponse: AxiosResponse<User> = await axios.get(`https://${url}:3333/user/${friend.id}`, {
					headers: {
						'Authorization': `Bearer ${token}`
					}
				})

				setUserTarget(userResponse.data)

				const heightCard = 390 // height de la carte
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
		catch (error) {
			if (axios.isAxiosError(error)) {
				const axiosError = error as AxiosError<ErrorResponse>
				const { statusCode, message } = axiosError.response?.data!
				if (statusCode === 403 || statusCode === 404)
					displayPopupError({ display: true, message: message })
				else
					displayPopupError({ display: true })
			}
			else
				displayPopupError({ display: true })
		}
	}

	async function showContextualMenu(event: MouseEvent<HTMLDivElement>) {
		try {
			const userResponse: AxiosResponse<User> = await axios.get(`https://${url}:3333/user/${friend.id}`, {
				headers: {
					'Authorization': `Bearer ${token}`
				}
			})

			setUserTarget(userResponse.data)

			const heightContextualMenu = await getContextualMenuHeight(contextualMenuStatus.SOCIAL, userTarget, userAuthenticate) // height du menu contextuel de la liste d'amis
			const horizontalBorder = window.innerHeight * 5 / 100 // height des bordures horizontales autour du jeu
			const maxBottom = window.innerHeight - horizontalBorder - heightContextualMenu // valeur max avant que le menu ne depasse par le bas

			const resultX = event.clientX // resultat horizontal par defaut (position du clic)
			let resultY = event.clientY // resultat vertical par defaut (position du clic)

			if (event.clientY - horizontalBorder / 2 > maxBottom) // verifie si le menu depasse sur l'axe vertical
				resultY -= event.clientY - horizontalBorder / 2 - maxBottom // ajuste le resultat vertical

			setContextualMenuPosition({ left: resultX, top: resultY })
			displayContextualMenu({ display: true, type: contextualMenuStatus.SOCIAL })
			displayCard(false)
		}
		catch (error) {
			if (axios.isAxiosError(error)) {
				const axiosError = error as AxiosError<ErrorResponse>
				const { statusCode, message } = axiosError.response?.data!
				if (statusCode === 403 || statusCode === 404)
					displayPopupError({ display: true, message: message })
				else
					displayPopupError({ display: true })
			}
			else
				displayPopupError({ display: true })
		}
	}

	function handleContextMenu(event: MouseEvent<HTMLDivElement>) {
		event.preventDefault();
	}

	return (
		<Style
			onClick={showCard}
			onAuxClick={showContextualMenu}
			onContextMenu={handleContextMenu}
			tabIndex={0}
			$sectionIndex={sectionIndex}
			$isBlocked={userIsBlocked(userAuthenticate, friend.id)}
			ref={friendContainerRef}>
			<Status $sectionIndex={sectionIndex} $status={friend.status} />
			<Avatar src={friend.avatar} />
			{
				social &&
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