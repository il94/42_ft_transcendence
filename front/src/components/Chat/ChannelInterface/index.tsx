import {
	Dispatch, 
	SetStateAction,
	useState
} from "react"

import Banner from "../ChatInterface/Banner"
import ChannelMenu from "./ChannelMenu"
import colors from "../../../utils/colors"
import styled from "styled-components"
import { Channel } from "../../../utils/types"

type PropsChannelInterface = {
	channel: Channel,
	updateChannel?: boolean,
	displayChannelInterface: Dispatch<SetStateAction<{
		display: boolean,
		updateChannel?: boolean
	}>>
}

const Style = styled.div`

	display: flex;
	flex-direction: column;

	width: 245px;
	height: 100%;

	background-color: ${colors.chatWindow};

`

function ChannelInterface({ channel, updateChannel, displayChannelInterface } : PropsChannelInterface) {

	const [channelNameOverview, setChannelNameOverview] = useState<string>(updateChannel ? channel.name : "Create")

	return (
		<Style>
			<Banner
				name={channelNameOverview}
				displaySettingsButton={false} />
			<ChannelMenu
				channel={channel}
				updateChannel={updateChannel}
				displayChannelInterface={displayChannelInterface}
				setChannelNameOverview={setChannelNameOverview} />
		</Style>
	)
}

export default ChannelInterface