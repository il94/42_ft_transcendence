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
import ButtonChallengeLocked from "../../../../../componentsLibrary/ButtonChallengeLocked"

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
								color={colors.buttonGreen}
								alt="Accept button" title="Accept">
								Accept
							</ButtonChallenge>
							:
							<ButtonChallengeLocked
								color={colors.buttonGray}
								title="Accept">
								Accept
							</ButtonChallengeLocked>
						}
						<ButtonChallenge
							onClick={() => handleClickChallengeStatus(challengeStatus.CANCELLED, idMsg, idChan, {
								userAuthenticate,
								displayPopupError,
								token,
								url
							})}
							color={colors.buttonRed}
							alt="Decline button" title="Decline">
							Decline
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
						<ButtonChallenge
						onClick={() =>
							userAuthenticate.socket?.emit("spectate", userAuthenticate.id, sender.id)}
							color={colors.button}
							alt="Spectate button" title="Spectate">
							Spectate
						</ButtonChallenge>
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
			</InvitationContent>
		</Style>
	)
}

export default ContactInvitation