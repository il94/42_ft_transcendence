import { Dispatch, SetStateAction, useContext } from "react"

import { Style, Avatar, ChannelName } from "./style"

import { ChannelData } from "../../../../utils/types"
import { channelStatus, chatWindowStatus } from "../../../../utils/status"
import InteractionContext from "../../../../contexts/InteractionContext"

type PropsChannel = {
	channel: ChannelData,
	setChannelTarget: Dispatch<SetStateAction<ChannelData | undefined>>,
	setChatWindowState: Dispatch<SetStateAction<chatWindowStatus>>,
	backgroundColor: string
}

function ChannelSection({ channel, setChannelTarget, setChatWindowState, backgroundColor }: PropsChannel) {

	const { userAuthenticate } = useContext(InteractionContext)!

	function handleClickChannelButton() {

		if (channel.type === channelStatus.PROTECTED && !channel.validUsers.includes(userAuthenticate))
			setChatWindowState(chatWindowStatus.LOCKED_CHANNEL)
		else
			setChatWindowState(chatWindowStatus.CHANNEL)

		setChannelTarget(channel)
	}

	return (
		<Style
			onClick={handleClickChannelButton}
			$backgroundColor={backgroundColor}>
			<Avatar src={channel.avatar} />
			<ChannelName>
				{channel.name}
			</ChannelName>
		</Style>
	)
}

export default ChannelSection