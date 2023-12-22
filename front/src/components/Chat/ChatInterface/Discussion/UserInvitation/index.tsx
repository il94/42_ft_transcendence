import {
	Style,
	Text,
	ButtonsWrapper,
	Button
} from "./style"

import { challengeStatus } from "../../../../../utils/status"

import { User } from "../../../../../utils/types"

import colors from "../../../../../utils/colors"

type PropsUserInvitation = {
	target: User,
	status: string
}

function UserInvitation({ target, status }: PropsUserInvitation) {
	return (
		<Style>
			<Text>
				You challenge {target.username} to a duel !
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

export default UserInvitation