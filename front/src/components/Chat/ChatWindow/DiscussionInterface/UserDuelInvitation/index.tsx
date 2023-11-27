import { 
	Style,
	Text,
	ButtonsWrapper,
	Button
} from "./style"

import colors from "../../../../../utils/colors"
import status from "../../../../../utils/status"

type PropsUserDuelInvitation = {
	opponent: string,
	state: string
}

function UserDuelInvitation({ opponent, state } : PropsUserDuelInvitation ) {
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
		</Style>
	)
}

export default UserDuelInvitation