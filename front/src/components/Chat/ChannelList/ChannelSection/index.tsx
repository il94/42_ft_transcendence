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

import { Channel } from "../../../../utils/types"
import { channelStatus } from "../../../../utils/status"

type PropsChannel = {
	channel: Channel,
	setChannelTarget: Dispatch<SetStateAction<Channel | undefined>>,
	setErrorRequest: Dispatch<SetStateAction<boolean>>,
	backgroundColor: string
}

function ChannelSection({ channel, setChannelTarget, setErrorRequest, backgroundColor }: PropsChannel) {

	const { token } = useContext(AuthContext)!
	
	async function handleClickEvent() {
		try {
			const channelWithRelationsResponse: AxiosResponse<Channel> = await axios.get(`http://localhost:3333/channel/${channel.id}/relations`, {
				headers: {
					'Authorization': `Bearer ${token}`
				}
			})
			setChannelTarget(channelWithRelationsResponse.data)
		}
		catch (error) {
			setErrorRequest(true)
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