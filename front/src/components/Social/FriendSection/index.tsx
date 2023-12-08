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
	displayContextualMenu: Dispatch<SetStateAction<{
		display: boolean,
		type: string
	}>>,
	setContextualMenuPosition: Dispatch<SetStateAction<{
		left?: number,
		top?: number,
		bottom?: number
	}>>
}

function FriendSection({ id, username, avatar, status, social, color, displayContextualMenu, setContextualMenuPosition }: PropsFriendSection) {

	const { card, displayCard, setCardPosition, cardIdTarget, setIdTargetCard } = useContext(CardContext)!
	const friendContainerRef: RefObject<HTMLElement> = useRef(null)

	function showCard() {

		if (card && cardIdTarget === id) // verifie que la carte a afficher ne l'est pas deja
		{
			displayCard(false)
			return;
		}

		const friendcontainer = friendContainerRef.current // sert a cibler le container et non ses enfants

		if (friendcontainer)
		{
			const heightCard = 371 // height de la carte
			const horizontalBorder = window.innerHeight * 5 / 100 // height des bordures horizontales autour du jeu
			const heightNavBar = 53 // height de la barre de navigation (logo, info, profil)
			const maxBottom = window.innerHeight - horizontalBorder - heightNavBar - heightCard // valeur max avant que la carte ne depasse par le bas

			let resultY = friendcontainer.getBoundingClientRect().top - horizontalBorder / 2 - heightNavBar // resultat par defaut (top container cible - bordure du haut - navbar)

			if (resultY > maxBottom) // verifie si la carte depasse sur l'axe vertical
				resultY = maxBottom // ajuste le resultat vertical

			setIdTargetCard(id)
			setCardPosition({ top: resultY })

			displayCard(true)
		}
	}

	function showContextualMenu(event: MouseEvent<HTMLDivElement>) {

		const heightContextualMenu = 175 // height du menu contextuel
		const horizontalBorder = window.innerHeight * 5 / 100 // height des bordures horizontales autour du jeu
		const maxBottom = window.innerHeight - horizontalBorder - heightContextualMenu // valeur max avant que le menu ne depasse par le bas

		const resultX = event.clientX // resultat horizontal par defaut (position du clic)
		let resultY = event.clientY // resultat vertical par defaut (position du clic)

		if (event.clientY - horizontalBorder / 2 > maxBottom) // verifie si le menu depasse sur l'axe vertical
			resultY -= event.clientY - horizontalBorder / 2 - maxBottom // ajuste le resultat vertical

		setContextualMenuPosition({ left: resultX, top: resultY })
		displayContextualMenu({ display: true, type: "social" })
		
	}

	function handleContextMenu(event: MouseEvent<HTMLDivElement>) {
		event.preventDefault();
	}

	return (
		<Style
			onClick={showCard}
			onAuxClick={showContextualMenu}
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