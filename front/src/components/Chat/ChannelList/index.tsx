import {
	Dispatch,
	SetStateAction,
	useContext
} from "react"

import styled from "styled-components"

import ChannelSection from "./ChannelSection"
import ScrollBar from "../../../componentsLibrary/ScrollBar"

import InteractionContext from "../../../contexts/InteractionContext"

import { getAllMembersInChannel } from "../../../utils/functions"

import { Channel } from "../../../utils/types"
import { channelStatus } from "../../../utils/status"

import colors from "../../../utils/colors"

const Style = styled.div`

	display: flex;
	flex-direction: column;

	width: 128px;

	background-color: ${colors.channelList};

`

type PropsChannelList = {
	channels: Channel[],
	setChannelTarget: Dispatch<SetStateAction<Channel | undefined>>,
	setErrorRequest: Dispatch<SetStateAction<boolean>>
}

function ChannelList({ channels, setChannelTarget, setErrorRequest }: PropsChannelList) {

	function setDataChannel(channel: Channel): Channel {
		if (channel.type === channelStatus.MP)
		{
			const members = getAllMembersInChannel(channel)
			const recipient = members.find((member) => member.id !== userAuthenticate.id)

			if (!recipient)
			{
				setErrorRequest(true)
				return (channel)
			}
			else
			{
				const { name, avatar, ...rest } = channel

				const channelMP: Channel = {
					name: recipient.username,
					avatar: recipient.avatar,
					...rest
				}

				return (channelMP)
			}
		}
		else
			return (channel)
	}

	const { userAuthenticate } = useContext(InteractionContext)!

	return (
		<Style>
			<ScrollBar>
				{
					channels.map((channel, index) => (
						<ChannelSection
							key={"channel" + index} // a definir
							channel={setDataChannel(channel)}
							setChannelTarget={setChannelTarget}
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