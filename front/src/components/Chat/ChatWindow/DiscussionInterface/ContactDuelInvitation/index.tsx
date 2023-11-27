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

type PropsContactDuelInvitation = {
	userName: string,
	opponent: string,
	state: string
}

function ContactDuelInvitation({ userName, opponent, state } : PropsContactDuelInvitation) {
	return (
		<Style>
			<ProfilePicture />
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