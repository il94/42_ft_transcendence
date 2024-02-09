import {
	useContext
} from "react"

import {
	Avatar,
	Style,
	Text,
	InvitationContent,
	ButtonsWrapper
} from "./style"

import {
	handleClickChallengeStatus,
	showCard,
	showContextualMenu
} from "../functions"

import ButtonChallenge from "../../../../../componentsLibrary/ButtonChallenge"

import ContextualMenuContext from "../../../../../contexts/ContextualMenuContext"
import CardContext from "../../../../../contexts/CardContext"
import DisplayContext from "../../../../../contexts/DisplayContext"
import InteractionContext from "../../../../../contexts/InteractionContext"
import AuthContext from "../../../../../contexts/AuthContext"

import {
	challengeStatus
} from "../../../../../utils/status"

import {
	User,
	UserAuthenticate
} from "../../../../../utils/types"

import colors from "../../../../../utils/colors"

type PropsContactInvitation = {
	sender: User,
	target: User | UserAuthenticate,
	initialStatus: challengeStatus,
	idMsg: number,
	idChan: number
}

function ContactInvitation({ sender, target, initialStatus, idMsg, idChan }: PropsContactInvitation) {

	const { token, url } = useContext(AuthContext)!
	const { displayContextualMenu, setContextualMenuPosition } = useContext(ContextualMenuContext)!
	const { displayCard, setCardPosition } = useContext(CardContext)!
	const { setZCardIndex, zMaxIndex, displayPopupError, GameWrapperRef } = useContext(DisplayContext)!
	const { userTarget, setUserTarget, userAuthenticate, channelTarget, gameState, searching } = useContext(InteractionContext)!

	return (
		<Style>
			<Avatar
				src={sender.avatar}
				onClick={(event) => showCard(event, sender, {
					displayCard,
					setZCardIndex,
					setCardPosition,
					setUserTarget,
					url,
					token,
					displayPopupError,
					zMaxIndex,
					GameWrapperRef
				})}
				onAuxClick={(event) => showContextualMenu(event, sender, {
					setContextualMenuPosition,
					displayContextualMenu,
					userAuthenticate,
					userTarget,
					setUserTarget,
					channelTarget,
					url,
					token,
					displayPopupError,
					GameWrapperRef
				})}
				tabIndex={0} />
			<InvitationContent>
				<Text>
					{sender.username} challenge {target.username} to a duel !
				</Text>
				{
					initialStatus === challengeStatus.PENDING && target.id === userAuthenticate.id &&
					<ButtonsWrapper>
						{
							(!gameState && !searching) ?
							<ButtonChallenge
								onClick={() => handleClickChallengeStatus(challengeStatus.ACCEPTED, idMsg, idChan, {
									userAuthenticate,
									displayPopupError,
									token,
									url
								})}
								color={colors.buttonGreen}>
								Accept
							</ButtonChallenge>
							:
							<ButtonChallenge
								color={colors.buttonGray}>
								Accept
							</ButtonChallenge>
						}
						<ButtonChallenge
							onClick={() => handleClickChallengeStatus(challengeStatus.CANCELLED, idMsg, idChan, {
								userAuthenticate,
								displayPopupError,
								token,
								url
							})}
							color={colors.buttonRed}>
							Decline
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
							Spectate
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
			</InvitationContent>
		</Style>
	)
}

export default ContactInvitation