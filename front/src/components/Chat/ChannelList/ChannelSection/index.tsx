import { Dispatch, SetStateAction, useContext } from "react"

import { Style, Avatar, ChannelName } from "./style"

import { ChannelData } from "../../../../utils/types"
import { chatWindowStatus } from "../../../../utils/status"

type PropsChannel = {
	channel: ChannelData,
	setChannelTarget: Dispatch<SetStateAction<ChannelData | undefined>>,
	setChatWindowState: Dispatch<SetStateAction<chatWindowStatus>>,
	backgroundColor: string
}

function ChannelSection({ channel, setChannelTarget, backgroundColor }: PropsChannel) {

	return (
		<Style
			onClick={() => setChannelTarget(channel)}
			$backgroundColor={backgroundColor}>
			<Avatar src={channel.avatar} />
			<ChannelName>
				{channel.name}
			</ChannelName>
		</Style>
	)
}

export default ChannelSection