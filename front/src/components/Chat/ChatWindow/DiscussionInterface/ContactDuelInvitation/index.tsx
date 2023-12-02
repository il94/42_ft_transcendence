import {
	Avatar,
	Style,
	Text,
	InvitationContent,
	ButtonsWrapper,
	Button
} from "./style"

import colors from "../../../../../utils/colors"
import status from "../../../../../utils/status"
import { MouseEvent, useContext } from "react"
import ContextualMenuContext from "../../../../../contexts/ContextualMenuContext"
import CardContext from "../../../../../contexts/CardContext"
import ZIndexContext from "../../../../../contexts/ZIndexContext"

type PropsContactDuelInvitation = {
	userName: string,
	opponent: string,
	state: string
}

function ContactDuelInvitation({ userName, opponent, state } : PropsContactDuelInvitation) {
	
	const { displayContextualMenu, setContextualMenuPosition } = useContext(ContextualMenuContext)!
	const { displayCard, setCardPosition } = useContext(CardContext)!
	const { setZCardIndex, zChatIndex } = useContext(ZIndexContext)!

	function showCard(event: MouseEvent<HTMLDivElement>) {

		const parentElementContainer = (event.target as HTMLElement).parentElement!.parentElement!.parentElement!.parentElement!.parentElement!.parentElement!.parentElement!

		if (parentElementContainer)
		{
			const { top: topParentElement, left: leftParentElement } = parentElementContainer.getBoundingClientRect()

			const resultY = Math.abs(topParentElement - event.clientY) - 371 // hauteur de la carte
			const resultX = Math.abs(leftParentElement - event.clientX) - 240 // largeur de la carte
			
			setCardPosition({ left: resultX, top: resultY })
			setZCardIndex(zChatIndex + 1)
			
			displayCard(true)
		}
	}

	function showContextualMenu(event: MouseEvent<HTMLDivElement>) {

		const parentElementContainer = (event.target as HTMLElement).parentElement!.parentElement!.parentElement!.parentElement!.parentElement
		const { bottom: bottomParentElement } = parentElementContainer!.getBoundingClientRect()


		const topMax = bottomParentElement - 175 // taille du menu
		const target = event.clientY

		const topMenu = target > topMax ? topMax : target // s'assure que la carte ne sorte pas de l'écran si elle est trop basse

		setContextualMenuPosition({ top: topMenu, left: event.clientX - 180 }) // +1 pour eviter que la souris soit directement sur le menu
		displayContextualMenu(true)

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
					state === status.PENDING &&
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
					state === status.ACCEPTED &&
					<ButtonsWrapper>
						<Button color={colors.buttonGreen}>
							Accepted !
						</Button>
					</ButtonsWrapper>
				}
				{
					state === status.CANCELLED &&
					<ButtonsWrapper>
						<Button color={colors.buttonGray}>
							Cancelled
						</Button>
					</ButtonsWrapper>
				}
				{
					state === status.IN_PROGRESS &&
					<ButtonsWrapper>
						<Button color={colors.button}>
							Spectate
						</Button>
					</ButtonsWrapper>
				}
				{
					state === status.FINISHED &&
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