import {
	Dispatch,
	SetStateAction,
	useContext
} from "react"
import axios from "axios"

import {
	ChannelName,
	ButtonsWrapper,
	Style,
	LeaveButtonWrapper
} from "./style"

import Icon from "../../../componentsLibrary/Icon"

import ChatContext from "../../../contexts/ChatContext"
import InteractionContext from "../../../contexts/InteractionContext"
import AuthContext from "../../../contexts/AuthContext"

import { channelStatus, chatWindowStatus } from "../../../utils/status"
import { Channel, User } from "../../../utils/types"

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

	const { token } = useContext(AuthContext)!
	const { userAuthenticate, setUserAuthenticate, channelTarget, setChannelTarget } = useContext(InteractionContext)!

	async function leaveChannel() {

		function getNewOwner(channel: Channel): User | undefined {

			const adminFind: User | undefined = channel.administrators.find((administrator) => administrator.id !== channel.owner.id)
			if (adminFind)
				return (adminFind)
			const memberFind: User | undefined = channel.users.find((user) => user.id !== channel.owner.id)
			if (memberFind)
				return (memberFind)
			return (undefined)
		}

		try {
			if (!channelTarget)
				throw (new Error)

			if (channelTarget.users.length === 1)
			{
				await axios.delete(`http://localhost:3333/channel/${channelTarget.id}`, {
					headers: {
						'Authorization': `Bearer ${token}`
					}
				})
				setChannelTarget(undefined)
			}
			else
			{
				/* ============ Temporaire ============== */

				// appeler la route qui supprime un user d'un channel
				// await axios.delete(`http://localhost:3333/channel/${channelTarget.id}/members/${userAuthenticate.id}`)

				/* ====================================== */

				setChannelTarget((prevState: Channel | undefined) => {
					if (prevState)
					{
						return {
							...prevState,
							users: prevState.users.filter((user) => user.id !== userAuthenticate.id),
							administrators: prevState.administrators.filter((administrator) => administrator.id !== userAuthenticate.id),
							owner: prevState.owner.id === userAuthenticate.id ? getNewOwner(channelTarget)! : prevState.owner
						}
					}
					else
						return (undefined)
				})
			}

			setUserAuthenticate((prevState) => ({
				...prevState,
				channels: prevState.channels.filter((channel) => channel.id !== channelTarget.id)
			}))

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
					chatWindowState === chatWindowStatus.LOCKED_CHANNEL) ?
					<Icon
						onClick={leaveChannel}
						src={LeaveIcon} size={24}
						alt="Leave button" title="Leave channel" />
					:
					<div style={{ width: "26.5px" }} />
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
					(channelTarget &&
					channelTarget.owner.id === userAuthenticate.id &&
					channelTarget.type !== channelStatus.MP &&
					chatWindowState === chatWindowStatus.CHANNEL) ?
					<Icon
						onClick={() => setChatWindowState(chatWindowStatus.UPDATE_CHANNEL)}
						src={SettingsIcon} size={24}
						alt="Settings button" title="Settings" />
					:
					<div style={{ width: "24px" }} />
				}
			</ButtonsWrapper>
		</Style>
	)
}

export default Banner