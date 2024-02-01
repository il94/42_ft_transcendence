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

	const { displayContextualMenu, setContextualMenuPosition } = useContext(ContextualMenuContext)!
	const { displayCard, setCardPosition } = useContext(CardContext)!
	const { setZCardIndex, zMaxIndex, GameWrapperRef } = useContext(DisplayContext)!
	const { userTarget, setUserTarget, userAuthenticate, channelTarget } = useContext(InteractionContext)!
	const { token, url } = useContext(AuthContext)!

	return (
		<Style>
			<Avatar
				src={sender.avatar}
				onClick={(event) => showCard(event, sender, {
					GameWrapperRef,
					setUserTarget,
					setCardPosition,
					setZCardIndex,
					zMaxIndex,
					displayCard
				})}
				onAuxClick={(event) => showContextualMenu(event, sender, {
					GameWrapperRef,
					channelTarget,
					setUserTarget,
					userTarget,
					userAuthenticate,
					setContextualMenuPosition,
					displayContextualMenu
				})}
				tabIndex={0} />
			<InvitationContent>
				<Text>
					{sender.username} challenge {target.username} to a duel !
				</Text>
				{
					initialStatus === challengeStatus.PENDING && target.id === userAuthenticate.id &&
					<ButtonsWrapper>
						<ButtonChallenge
							onClick={() => handleClickChallengeStatus(challengeStatus.ACCEPTED, idMsg, idChan, {
								userAuthenticate,
								token,
								url
							})}
							color={colors.buttonGreen}>
							Accept
						</ButtonChallenge>
						<ButtonChallenge
							onClick={() => handleClickChallengeStatus(challengeStatus.CANCELLED, idMsg, idChan, {
								userAuthenticate,
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