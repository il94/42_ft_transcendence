import { Dispatch, SetStateAction, useContext } from "react"

import { ChannelName, ButtonsWrapper, Style } from "./style"

import Icon from "../../../componentsLibrary/Icon"

import ChatContext from "../../../contexts/ChatContext"

import { chatWindowStatus } from "../../../utils/status"
import { Channel } from "../../../utils/types"

import ReduceIcon from "../../../assets/reduce.png"
import SettingsIcon from "../../../assets/settings.png"

type PropsBanner = {
	chatWindowState: chatWindowStatus,
	setChatWindowState: Dispatch<SetStateAction<chatWindowStatus>>,
	channel: Channel | undefined,
	channelNameOverview: string | undefined
}

function Banner({ chatWindowState, setChatWindowState, channel, channelNameOverview } : PropsBanner) {

	const { displayChat } = useContext(ChatContext)!

	return (
		<Style>
			<ChannelName>
			{
				channel ?
					chatWindowState === chatWindowStatus.CHANNEL ?
						channel.name 
					:
						channelNameOverview
				:
				"Error"
			}
			</ChannelName>
			<ButtonsWrapper>
				<Icon
					onClick={() => displayChat(false)}
					src={ReduceIcon} size={24}
					alt="Reduce button" title="Reduce" />
				{
					chatWindowState !== chatWindowStatus.CREATE_CHANNEL &&
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