import { Dispatch, SetStateAction, useContext } from "react"
// import axios from "axios"

import { ChannelName, ButtonsWrapper, Style, LeaveButtonWrapper } from "./style"

import Icon from "../../../componentsLibrary/Icon"

import ChatContext from "../../../contexts/ChatContext"
import InteractionContext from "../../../contexts/InteractionContext"

import { channelStatus, chatWindowStatus } from "../../../utils/status"

import LeaveIcon from "../../../assets/deconnexion.png"
import ReduceIcon from "../../../assets/reduce.png"
import SettingsIcon from "../../../assets/settings.png"

type PropsBanner = {
	chatWindowState: chatWindowStatus,
	setChatWindowState: Dispatch<SetStateAction<chatWindowStatus>>,
	bannerName: string,
	setErrorRequest: Dispatch<SetStateAction<boolean>>
}

function Banner({ chatWindowState, setChatWindowState, bannerName, setErrorRequest }: PropsBanner) {

	const { userAuthenticate, channelTarget, setChannelTarget } = useContext(InteractionContext)!

	async function leaveChannel() {
		try {
			if (!channelTarget)
				throw (new Error)

			/* ============ Temporaire ============== */

			// await axios.delete(`http://localhost:3333/channel/${channelTarget.id}/members/${userAuthenticate.id}`)

			/* ====================================== */

			channelTarget.users.splice(channelTarget.users.indexOf(userAuthenticate), 1)

			/* ============ Temporaire ============== */

			// await axios.delete(`http://localhost:3333/user/me/channels/${userAuthenticate.id}`)

			/* ====================================== */

			userAuthenticate.channels.splice(userAuthenticate.channels.indexOf(channelTarget), 1)

			setChannelTarget(undefined)
		}
		catch (error) {
			setErrorRequest(true)
		}
	}

	const { displayChat } = useContext(ChatContext)!

	return (
		<Style>
			<LeaveButtonWrapper>
				{
					(chatWindowState === chatWindowStatus.CHANNEL ||
					chatWindowState === chatWindowStatus.LOCKED_CHANNEL) &&
					<Icon
						onClick={leaveChannel}
						src={LeaveIcon} size={24}
						alt="Leave button" title="Leave channel" />
				}
			</LeaveButtonWrapper>
			<ChannelName>
				{bannerName}
			</ChannelName>
			<ButtonsWrapper>
				<Icon
					onClick={() => displayChat(false)}
					src={ReduceIcon} size={24}
					alt="Reduce button" title="Reduce" />
				{
					channelTarget &&
					channelTarget.owner === userAuthenticate &&
					channelTarget.type !== channelStatus.MP &&
					chatWindowState === chatWindowStatus.CHANNEL &&
					<Icon
						onClick={() => setChatWindowState(chatWindowStatus.UPDATE_CHANNEL)}
						src={SettingsIcon} size={24}
						alt="Settings button" title="Settings" />
				}
			</ButtonsWrapper>
		</Style>
	)
}

export default Banner