import { 
	Style,
	Text,
	ButtonsWrapper,
	Button
} from "./style"

import colors from "../../../../../utils/colors"
import status from "../../../../../utils/status"

type UserDuelInvitationProps = {
	opponent: string,
	state: string
}

function UserDuelInvitation({ opponent, state } : UserDuelInvitationProps ) {
	return (
		<Style>
			<Text>
				You challenge {opponent} to a duel !
			</Text>
			{
				state === status.PENDING &&
				<ButtonsWrapper>
					<Button color={colors.buttonRed}>
						Cancel
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
				state === status.FINISHED &&
				<ButtonsWrapper>
					<Button color={colors.button}>
						Finished
					</Button>
				</ButtonsWrapper>
			}
		</Style>
	)
}

export default UserDuelInvitation