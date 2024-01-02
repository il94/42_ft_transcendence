import {
	Style,
	Text,
	ButtonsWrapper
} from "./style"

import ButtonChallenge from "../../../../../componentsLibrary/ButtonChallenge"

import { challengeStatus } from "../../../../../utils/status"

import { User } from "../../../../../utils/types"

import colors from "../../../../../utils/colors"
import { useState } from "react"

type PropsUserInvitation = {
	target: User,
	initialStatus: challengeStatus
}

function UserInvitation({ target, initialStatus }: PropsUserInvitation) {

	const [status, setStatus] = useState<challengeStatus>(initialStatus)

	return (
		<Style>
			<Text>
				You challenge {target.username} to a duel !
			</Text>
			{
				status === challengeStatus.PENDING &&
				<ButtonsWrapper>
					<ButtonChallenge
						onClick={() => setStatus(challengeStatus.CANCELLED)}
						color={colors.buttonRed}>
						Cancel
					</ButtonChallenge>
				</ButtonsWrapper>
			}
			{
				status === challengeStatus.ACCEPTED &&
				<ButtonsWrapper>
					<ButtonChallenge
						color={colors.buttonGreen}>
						Accepted !
					</ButtonChallenge>
				</ButtonsWrapper>
			}
			{
				status === challengeStatus.CANCELLED &&
				<ButtonsWrapper>
					<ButtonChallenge
						color={colors.buttonGray}>
						Cancelled
					</ButtonChallenge>
				</ButtonsWrapper>
			}
			{
				status === challengeStatus.IN_PROGRESS &&
				<ButtonsWrapper>
					<ButtonChallenge
						color={colors.button}>
						In progress
					</ButtonChallenge>
				</ButtonsWrapper>
			}
			{
				status === challengeStatus.FINISHED &&
				<ButtonsWrapper>
					<ButtonChallenge
						color={colors.button}>
						Finished
					</ButtonChallenge>
				</ButtonsWrapper>
			}
		</Style>
	)
}

export default UserInvitation