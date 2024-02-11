import {
	Dispatch,
	SetStateAction,
	useContext
} from "react"
import axios, { AxiosError, AxiosResponse } from "axios"

import {
	Style
} from "./style"

import ScrollBar from "../../../componentsLibrary/ScrollBar"
import Section, { SectionName } from "../../../componentsLibrary/Section"

import InteractionContext from "../../../contexts/InteractionContext"
import DisplayContext from "../../../contexts/DisplayContext"
import AuthContext from "../../../contexts/AuthContext"

import {
	userIsBanned,
	userIsBlocked,
	userIsInChannel
} from "../../../utils/functions"

import {
	Channel,
	ErrorResponse
} from "../../../utils/types"

import {
	ChannelType
} from "../../../utils/status"

type PropsSecondaryContextualMenu = {
	displaySecondaryContextualMenu: Dispatch<SetStateAction<boolean>>,
	secondaryContextualMenuPosition: {
		left?: number,
		right?: number,
		top?: number,
		bottom?: number
	},
	secondaryContextualMenuHeight: number,
	channels: Channel[]
}

function SecondaryContextualMenu({ displaySecondaryContextualMenu, secondaryContextualMenuPosition, secondaryContextualMenuHeight, channels }: PropsSecondaryContextualMenu) {

	const { token, url } = useContext(AuthContext)!
	const { userAuthenticate, userTarget } = useContext(InteractionContext)!
	const { displayPopupError } = useContext(DisplayContext)!

	function channelCanBeJoined(channel: Channel): boolean {
		if (channel.type === ChannelType.MP
			|| userIsBlocked(userAuthenticate, userTarget.id))
			return (false)
		return (true)
	}

	async function handleInviteClickEvent(channel: Channel) {
		try {
			const channelWithRelationsResponse: AxiosResponse<Channel> = await axios.get(`https://${url}:3333/channel/${channel.id}/relations`, {
				headers: {
					'Authorization': `Bearer ${token}`
				}
			})
			
			if (userIsInChannel(channelWithRelationsResponse.data, userTarget.id))
				displayPopupError({ display: true, message: `${userTarget.username} is already in this channel` })
			else if (userIsBanned(channelWithRelationsResponse.data, userTarget.id))
				displayPopupError({ display: true, message: `${userTarget.username} is banned from this channel` })
			else
			{
				await axios.post(`https://${url}:3333/channel/${channel.id}/add/${userTarget.id}`, {}, {
					headers: {
						'Authorization': `Bearer ${token}`
					}
				})
			}
		}
		catch (error) {
			if (axios.isAxiosError(error)) {
				const axiosError = error as AxiosError<ErrorResponse>
				const { statusCode, message } = axiosError.response?.data!
				if (statusCode === 403 || statusCode === 404 || statusCode === 409)
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
			onMouseLeave={() => displaySecondaryContextualMenu(false)}
			$left={secondaryContextualMenuPosition.left}
			$right={secondaryContextualMenuPosition.right}
			$top={secondaryContextualMenuPosition.top}
			$bottom={secondaryContextualMenuPosition.bottom}
			height={secondaryContextualMenuHeight}>
			<ScrollBar visible>
				{
					channels.filter((channel) => channelCanBeJoined(channel))
						.map((channel) => (
							<Section
								key={"channelSection" + channel.id}
								onClick={() => handleInviteClickEvent(channel)}>
								<SectionName>
									{channel.name}
								</SectionName>
							</Section>
						))
				}
			</ScrollBar>
		</Style>
	)
}

export default SecondaryContextualMenu
