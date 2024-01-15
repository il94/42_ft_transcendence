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

import { channelIsEmpty } from "../../../utils/functions"

import { channelStatus, chatWindowStatus } from "../../../utils/status"
import { Channel, User } from "../../../utils/types"

import DeleteIcon from "../../../assets/close.png"
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

	function getNewOwner(channel: Channel): User | undefined {
		const adminFind: User | undefined = channel.administrators.find((administrator) => administrator.id !== channel.owner?.id)
		if (adminFind)
			return (adminFind)
		const memberFind: User | undefined = channel.members.find((member) => member.id !== channel.owner?.id)
		if (memberFind)
			return (memberFind)
		return (undefined)
	}

	const { token } = useContext(AuthContext)!
	const { userAuthenticate, setUserAuthenticate, channelTarget, setChannelTarget } = useContext(InteractionContext)!

	async function deleteChannelMP() {
		try {
			if (!channelTarget)
				throw new Error
		
			await axios.delete(`http://localhost:3333/channel/${channelTarget.id}`, {
				headers: {
					'Authorization': `Bearer ${token}`
				}
			})

			setUserAuthenticate((prevState) => ({
				...prevState,
				channels: prevState.channels.filter((channel) => channel.id !== channelTarget.id)
			}))

			setChannelTarget(undefined)
		}
		catch (error) {
			throw error
		}
	}

	async function leaveChannel() {

		async function deleteChannel(channelId: number) {
			try {
				await axios.delete(`http://localhost:3333/channel/${channelId}`, {
					headers: {
						'Authorization': `Bearer ${token}`
					}
				})
				setChannelTarget(undefined)
			}
			catch (error) {
				throw error
			}
		}

		async function memberLeaveChannel(channelId: number) {
			try {
				await axios.delete(`http://localhost:3333/channel/leave/${channelId}`, {
					headers: {
						'Authorization': `Bearer ${token}`
					}
				})
					
				setUserAuthenticate((prevState) => ({
					...prevState,
					channels: prevState.channels.filter((channel) => channel.id !== channelId)
				}))

				setChannelTarget((prevState: Channel | undefined) => {
					if (prevState)
					{
						console.log("PREVSTATE", prevState)
						const { members, administrators, owner , ...rest } = prevState
						
						return {
							...rest,
							members: prevState.members.filter((member) => member.id !== userAuthenticate.id),
							administrators: prevState.administrators.filter((administrator) => administrator.id !== userAuthenticate.id),
							owner: prevState.owner?.id === userAuthenticate.id ? getNewOwner(prevState) : prevState.owner
						}
					}
					else
						return (undefined)
				})

				setChannelTarget(undefined)
			}
			catch (error) {
				console.log(error)
				throw error
			}
		}

		try {
			if (channelTarget)
			{
				await memberLeaveChannel(channelTarget.id)
				if (channelIsEmpty(channelTarget))
					await deleteChannel(channelTarget.id)
			}
			else
				throw new Error
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
					channelTarget?.type === channelStatus.MP ?
					<Icon
						onClick={deleteChannelMP}
						src={DeleteIcon} size={24}
						alt="Leave button" title="Leave channel" />
					:
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
					channelTarget.owner?.id === userAuthenticate.id &&
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