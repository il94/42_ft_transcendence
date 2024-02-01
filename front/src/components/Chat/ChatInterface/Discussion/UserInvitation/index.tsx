import {
	useContext
} from "react"

import {
	Style,
	Text,
	ButtonsWrapper
} from "./style"

import {
	handleClickChallengeStatus
} from "../functions"

import ButtonChallenge from "../../../../../componentsLibrary/ButtonChallenge"

import AuthContext from "../../../../../contexts/AuthContext"
import InteractionContext from "../../../../../contexts/InteractionContext"

import {
	User,
	UserAuthenticate
} from "../../../../../utils/types"

import {
	challengeStatus
} from "../../../../../utils/status"

import colors from "../../../../../utils/colors"

type PropsUserInvitation = {
	target: User | UserAuthenticate,
	initialStatus: challengeStatus
	idMsg: number,
	idChan: number
}

function UserInvitation({ target, initialStatus, idMsg, idChan }: PropsUserInvitation) {

	const { token, url } = useContext(AuthContext)!
	const { userAuthenticate } = useContext(InteractionContext)!

	return (
		<Style>
			<Text>
				You challenge {target.username} to a duel !
			</Text>
			{
				initialStatus === challengeStatus.PENDING &&
				<ButtonsWrapper>
					<ButtonChallenge
						onClick={() => handleClickChallengeStatus(challengeStatus.CANCELLED, idMsg, idChan, {
							userAuthenticate,
							token,
							url
						})}
						color={colors.buttonRed}>
						Cancel
					</ButtonChallenge>
				</ButtonsWrapper>
			}
			{
				initialStatus === challengeStatus.ACCEPTED &&
				<ButtonsWrapper>
					<ButtonChallenge
						color={colors.buttonGreen}>
						Accepted !
					</ButtonChallenge>
				</ButtonsWrapper>
			}
			{
				initialStatus === challengeStatus.CANCELLED &&
				<ButtonsWrapper>
					<ButtonChallenge
						color={colors.buttonGray}>
						Cancelled
					</ButtonChallenge>
				</ButtonsWrapper>
			}
			{
				initialStatus === challengeStatus.IN_PROGRESS &&
				<ButtonsWrapper>
					<ButtonChallenge
						color={colors.button}>
						In progress
					</ButtonChallenge>
				</ButtonsWrapper>
			}
			{
				initialStatus === challengeStatus.FINISHED &&
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