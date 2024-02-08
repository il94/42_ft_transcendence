import {
	useContext
} from "react"
import axios, { AxiosError, AxiosResponse } from "axios"

import {
	Style,
	Avatar,
	ChannelName
} from "./style"

import AuthContext from "../../../../contexts/AuthContext"
import InteractionContext from "../../../../contexts/InteractionContext"
import DisplayContext from "../../../../contexts/DisplayContext"

import {
	Channel,
	ErrorResponse
} from "../../../../utils/types"

type PropsChannel = {
	channel: Channel,
}

function ChannelSection({ channel }: PropsChannel) {

	const { token, url } = useContext(AuthContext)!
	const { setChannelTarget } = useContext(InteractionContext)!
	const { setLoaderChat, displayPopupError } = useContext(DisplayContext)!
	
	async function handleClickEvent() {
		try {
			setLoaderChat(true)
			
			const channelWithRelationsResponse: AxiosResponse<Channel> = await axios.get(`https://${url}:3333/channel/${channel.id}/relations`, {
				headers: {
					'Authorization': `Bearer ${token}`
				}
			})

			setChannelTarget(channelWithRelationsResponse.data)
			setLoaderChat(false)
		}
		catch (error) {
			if (axios.isAxiosError(error)) {
				const axiosError = error as AxiosError<ErrorResponse>
				const { statusCode, message } = axiosError.response?.data!
				if (statusCode === 403 || statusCode === 404)
					displayPopupError({ display: true, message: message })
				else
					displayPopupError({ display: true })
			}
			else
				displayPopupError({ display: true })
		}
	}

	return (
		<Style
			onClick={handleClickEvent}
			tabIndex={0}
			$id={channel.id}>
			<Avatar src={channel.avatar} />
			<ChannelName>
				{channel.name}
			</ChannelName>
		</Style>
	)
}

export default ChannelSection