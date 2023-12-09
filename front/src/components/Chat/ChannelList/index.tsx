import { Dispatch, SetStateAction, useEffect, useState } from "react"

import { Style, ChannelCreateButton } from "./style"

import ChannelSection from "./ChannelSection"
import ScrollBar from "../../../componentsLibrary/ScrollBar"

import { Channel } from "../../../utils/types"

import colors from "../../../utils/colors"

type PropsChannelList = {
	channels: Channel[],
	setChannelIdTarget: Dispatch<SetStateAction<number>>,
	channelInterface: {
		display: boolean,
		updateChannel?: boolean
	},
	displayChannelInterface: Dispatch<SetStateAction<{
		display: boolean,
		updateChannel?: boolean
	}>>
}

function ChannelList({ channels, setChannelIdTarget, channelInterface, displayChannelInterface } : PropsChannelList) {

	const [valueChannelCreateButton, setValueChannelCreateButton] = useState<string>("Create")

	useEffect(() => {
		if (channelInterface.display)
			setValueChannelCreateButton("<<")
		else
			setValueChannelCreateButton("Create")
	}, [channelInterface])

	return (
		<Style>
			<ChannelCreateButton onClick={() => displayChannelInterface({ display: !channelInterface.display, updateChannel: false })}>
				{valueChannelCreateButton}
			</ChannelCreateButton>
			<ScrollBar>
			{
				channels.map((channel, index) => (
					<ChannelSection
						key={"channel" + index} // a definir
						id={channel.id}
						setChannelIdTarget={setChannelIdTarget}
						name={channel.name}
						avatar={channel.avatar}
						backgroundColor={!(index % 2) ? colors.sectionTransparent : colors.sectionAltTransparent}
					/>
				))
			}
			</ScrollBar>
		</Style>
	)
}

export default ChannelList