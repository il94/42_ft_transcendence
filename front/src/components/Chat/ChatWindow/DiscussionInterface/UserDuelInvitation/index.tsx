import { 
	Style,
	Text,
	ButtonsWrapper,
	Button
} from "./style"

import colors from "../../../../../utils/colors"
import { challengeStatus } from "../../../../../utils/status"

type PropsUserDuelInvitation = {
	opponent: string,
	status: string
}

function UserDuelInvitation({ opponent, status } : PropsUserDuelInvitation ) {
	return (
		<Style>
			<Text>
				You challenge {opponent} to a duel !
			</Text>
			{
				status === challengeStatus.PENDING &&
				<ButtonsWrapper>
					<Button color={colors.buttonRed}>
						Cancel
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
		</Style>
	)
}

export default UserDuelInvitation