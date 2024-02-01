import {
	useContext
} from "react"
import styled from "styled-components"

import ChannelSection from "./ChannelSection"
import ScrollBar from "../../../componentsLibrary/ScrollBar"
import Loader from "../../../componentsLibrary/Loader"

import DisplayContext from "../../../contexts/DisplayContext"

import {
	Channel
} from "../../../utils/types"

import colors from "../../../utils/colors"

const Style = styled.div`

	display: flex;
	flex-direction: column;

	position: relative;

	width: 128px;

	background-color: ${colors.channelList};

`

type PropsChannelList = {
	channels: Channel[]
}

function ChannelList({ channels }: PropsChannelList) {

	const { loaderChannels } = useContext(DisplayContext)!

	return (
		<Style>
			{
				loaderChannels ?
				<Loader size={100} />
				:
				<ScrollBar>
				{
					channels.map((channel, index) => (
						<ChannelSection
						key={"channel" + index} // a definir
						channel={channel}
						/>
					))
				}
			</ScrollBar>
			}
		</Style>
	)
}

export default ChannelList