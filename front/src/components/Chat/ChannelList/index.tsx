import {
	Dispatch,
	SetStateAction
} from "react"

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
	setErrorRequest: Dispatch<SetStateAction<boolean>>
}

function ChannelList({ channels, setErrorRequest }: PropsChannelList) {

	return (
		<Style>
			<ScrollBar>
				{
					channels.map((channel, index) => (
						<ChannelSection
							key={"channel" + index} // a definir
							channel={channel}
							setErrorRequest={setErrorRequest}
							backgroundColor={!(index % 2) ? colors.sectionTransparent : colors.sectionAltTransparent}
						/>
					))
				}
			</ScrollBar>
		</Style>
	)
}

export default ChannelList