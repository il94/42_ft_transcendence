import {
	Avatar,
	Style,
	Text,
	InvitationContent,
	ButtonsWrapper,
	Button
} from "./style"

import colors from "../../../../../utils/colors"
import { MouseEvent, useContext } from "react"
import ContextualMenuContext from "../../../../../contexts/ContextualMenuContext"
import CardContext from "../../../../../contexts/CardContext"
import ZIndexContext from "../../../../../contexts/ZIndexContext"
import { challengeStatus } from "../../../../../utils/status"

type PropsContactDuelInvitation = {
	userName: string,
	opponent: string,
	status: string
}

function ContactDuelInvitation({ userName, opponent, status } : PropsContactDuelInvitation) {
	
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

		const resultX = window.innerWidth - event.clientX
		const resultY = window.innerHeight - event.clientY

		setContextualMenuPosition({ right: resultX, bottom: resultY })
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