import styled from "styled-components"

import ChannelSection from "./ChannelSection"
import ScrollBar from "../../../componentsLibrary/ScrollBar"

import { Channel } from "../../../utils/types"

import colors from "../../../utils/colors"

const Style = styled.div`

	display: flex;
	flex-direction: column;

	width: 128px;
	height: 100%;

	background-color: ${colors.contactList};

`

type PropsChannelList = {
	channels: Channel[]
}

function ChannelList({ channels } : PropsChannelList) {

	return (
		<Style>
			<ScrollBar>
			{
				channels.map((channel, index) => (
					<ChannelSection
						key={"channel" + index} // a definir
						id={channel.id}
						name={channel.name}
						picture={channel.picture}
						type={channel.type}
						color={!(index % 2) ? colors.sectionTransparent : colors.sectionAltTransparent}
					/>
				))
			}
			</ScrollBar>
		</Style>
	)
}

export default ChannelList