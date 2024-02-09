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
import ButtonChallengeLocked from "../../../../../componentsLibrary/ButtonChallengeLocked"

import AuthContext from "../../../../../contexts/AuthContext"
import InteractionContext from "../../../../../contexts/InteractionContext"
import DisplayContext from "../../../../../contexts/DisplayContext"

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
	const { displayPopupError } = useContext(DisplayContext)!

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
							displayPopupError,
							token,
							url
						})}
						color={colors.buttonRed}
						alt="Cancel button" title="Cancel">
						Cancel
					</ButtonChallenge>
				</ButtonsWrapper>
			}
			{
				initialStatus === challengeStatus.ACCEPTED &&
				<ButtonsWrapper>
					<ButtonChallengeLocked
						color={colors.buttonGreen}
						title="Accepted">
						Accepted !
					</ButtonChallengeLocked>
				</ButtonsWrapper>
			}
			{
				initialStatus === challengeStatus.CANCELLED &&
				<ButtonsWrapper>
					<ButtonChallengeLocked
						color={colors.buttonGray}
						title="Cancelled">
						Cancelled
					</ButtonChallengeLocked>
				</ButtonsWrapper>
			}
			{
				initialStatus === challengeStatus.IN_PROGRESS &&
				<ButtonsWrapper>
					<ButtonChallengeLocked
						color={colors.button}
						title="In progress">
						In progress
					</ButtonChallengeLocked>
				</ButtonsWrapper>
			}
			{
				initialStatus === challengeStatus.FINISHED &&
				<ButtonsWrapper>
					<ButtonChallengeLocked
						color={colors.button}
						title="Finished">
						Finished
					</ButtonChallengeLocked>
				</ButtonsWrapper>
			}
		</Style>
	)
}

export default UserInvitation