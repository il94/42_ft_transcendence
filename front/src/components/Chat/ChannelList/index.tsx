import { Dispatch, SetStateAction } from "react"

import styled from "styled-components"

import ChannelSection from "./ChannelSection"
import ScrollBar from "../../../componentsLibrary/ScrollBar"

import { Channel } from "../../../utils/types"

import colors from "../../../utils/colors"

const Style = styled.div`

	display: flex;
	flex-direction: column;

	width: 128px;

	background-color: ${colors.channelList};

`

type PropsChannelList = {
	channels: Channel[],
	setChannelIdTarget: Dispatch<SetStateAction<number>>
}

function ChannelList({ channels, setChannelIdTarget } : PropsChannelList) {

	return (
		<Style>
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