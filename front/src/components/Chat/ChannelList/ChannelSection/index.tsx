import {
	Dispatch,
	SetStateAction,
	useContext
} from "react"
import axios, { AxiosResponse } from "axios"

import {
	Style,
	Avatar,
	ChannelName
} from "./style"

import AuthContext from "../../../../contexts/AuthContext"
import InteractionContext from "../../../../contexts/InteractionContext"

import { Channel } from "../../../../utils/types"

type PropsChannel = {
	channel: Channel,
	backgroundColor: string
}

function ChannelSection({ channel, backgroundColor }: PropsChannel) {

	const { token, url } = useContext(AuthContext)!
	const { setChannelTarget } = useContext(InteractionContext)!
	
	async function handleClickEvent() {
		try {
			const channelWithRelationsResponse: AxiosResponse<Channel> = await axios.get(`http://${url}:3333/channel/${channel.id}/relations`, {
				headers: {
					'Authorization': `Bearer ${token}`
				}
			})
			setChannelTarget(channelWithRelationsResponse.data)
		}
		catch (error) {
			// setErrorRequest(true)
		}
	}

	return (
		<Style
			onClick={handleClickEvent}
			$backgroundColor={backgroundColor}>
			<Avatar src={channel.avatar} />
			<ChannelName>
				{channel.name}
			</ChannelName>
		</Style>
	)
}

export default ChannelSection