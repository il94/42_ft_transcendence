import { Dispatch, SetStateAction } from "react"

import { Style, ChannelCreateButton } from "./style"

import ChannelSection from "./ChannelSection"
import ScrollBar from "../../../componentsLibrary/ScrollBar"

import { Channel } from "../../../utils/types"

import colors from "../../../utils/colors"

type PropsChannelList = {
	channels: Channel[],
	displayCreateChannelMenu: Dispatch<SetStateAction<boolean>>
}

function ChannelList({ channels, displayCreateChannelMenu } : PropsChannelList) {

	return (
		<Style>
			<ChannelCreateButton onClick={() => displayCreateChannelMenu(true)} />
			<ScrollBar>
			{
				channels.map((channel, index) => (
					<ChannelSection
						key={"channel" + index} // a definir
						// _id={channel.id}
						name={channel.name}
						avatar={channel.avatar}
						// _type={channel.type}
						color={!(index % 2) ? colors.sectionTransparent : colors.sectionAltTransparent}
					/>
				))
			}
			</ScrollBar>
		</Style>
	)
}

export default ChannelList