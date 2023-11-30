import {
	ProfilePicture,
	Style,
	Text,
	InvitationContent,
	ButtonsWrapper,
	Button
} from "./style"

import colors from "../../../../../utils/colors"
import status from "../../../../../utils/status"
import { Dispatch, MouseEvent, SetStateAction, useContext } from "react"
import MenuContextualContext from "../../../../../contexts/MenuContextualContext"

type PropsContactDuelInvitation = {
	userName: string,
	opponent: string,
	state: string,
	displayMenuContextual: Dispatch<SetStateAction<boolean>>,
	setMenuContextualPosition: Dispatch<SetStateAction<{
		top: number,
		left: number
	}>>
}

function ContactDuelInvitation({ userName, opponent, state, displayMenuContextual, setMenuContextualPosition } : PropsContactDuelInvitation) {
	
	// const { displayMenuContextual, setMenuContextualPosition } = useContext(MenuContextualContext)!

	// function showMenuContextual(event: MouseEvent<HTMLDivElement>) {

	// 	// const friendcontainer = friendContainerRef.current



	// 	const parentElementContainer = event.target.parentElement.parentElement.parentElement.parentElement.parentElement
	// 	// // if (friendcontainer) {
	// 	const { bottom: bottomParentElement } = parentElementContainer.getBoundingClientRect()

	// 	// console.log(parentElementContainer)
	// 	// console.log(bottomParentElement)

	// 	const topMax = bottomParentElement - 175 // taille du menu
	// 	const target = event.clientY

	// 	const topMenu = target > topMax ? topMax : target // s'assure que la carte ne sorte pas de l'écran si elle est trop basse

	// 	// 	// setMenuContextualPosition({ top: topMenu, left: event.clientX + 1 }) // +1 pour eviter que la souris soit directement sur le menu
	// 	// 	// displayMenuContextual(true)
	// 	// // }



	// 	console.log(event.clientX, " , ", event.clientY)
	// 	console.log(bottomParentElement)

	// 	setMenuContextualPosition({ top: -50, left: 0 }) // +1 pour eviter que la souris soit directement sur le menu
	// 	displayMenuContextual(true)

	// }

	return (
		<Style>
			<ProfilePicture /* onAuxClick={showMenuContextual} */ />
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