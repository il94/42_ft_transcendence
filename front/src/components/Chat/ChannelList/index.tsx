import { Dispatch, SetStateAction, useEffect, useState } from "react"

import { Style, ChannelCreateButton } from "./style"

import ChannelSection from "./ChannelSection"
import ScrollBar from "../../../componentsLibrary/ScrollBar"

import { Channel } from "../../../utils/types"

import colors from "../../../utils/colors"

type PropsChannelList = {
	channels: Channel[],
	createChannelMenu: boolean,
	displayCreateChannelMenu: Dispatch<SetStateAction<boolean>>
}

function ChannelList({ channels, createChannelMenu, displayCreateChannelMenu } : PropsChannelList) {

	const [valueChannelCreateButton, setValueChannelCreateButton] = useState<string>("Create")

	useEffect(() => {
		if (createChannelMenu)
			setValueChannelCreateButton("<<")
		else
			setValueChannelCreateButton("Create")
	}, [createChannelMenu])

	return (
		<Style>
			<ChannelCreateButton onClick={() => displayCreateChannelMenu(!createChannelMenu)}>
				{valueChannelCreateButton}
			</ChannelCreateButton>
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