import { Dispatch, SetStateAction } from "react"
// import axios from "axios"

import { Style } from "./style"

import ScrollBar from "../../../componentsLibrary/ScrollBar"
import Section, { SectionName } from "../../../componentsLibrary/Section"
import ErrorRequest from "../../../componentsLibrary/ErrorRequest"

import { ChannelData, User, UserAuthenticate } from "../../../utils/types"

type PropsSecondaryContextualMenu = {
	displaySecondaryContextualMenu: Dispatch<SetStateAction<boolean>>,
	userTarget: User | UserAuthenticate,
	secondaryContextualMenuPosition: {
		left?: number,
		right?: number,
		top?: number,
		bottom?: number
	},
	secondaryContextualMenuHeight: number,
	channels: ChannelData[] | undefined,
	displayErrorContextualMenu: Dispatch<SetStateAction<boolean>>
}

function SecondaryContextualMenu({ displaySecondaryContextualMenu, userTarget, secondaryContextualMenuPosition, secondaryContextualMenuHeight, channels, displayErrorContextualMenu } : PropsSecondaryContextualMenu) {

	async function handleInviteClickEvent(channel: ChannelData) {
		try {
			if (!channel.users.includes(userTarget))
			{
				/* ============ Temporaire ============== */
	
				// await axios.post(`http://localhost:3333/channel/${channel.id}/users/${userTarget.id}`, userTarget)
	
				/* ====================================== */
				channel.users.push(userTarget)
			}
		}
		catch (error) {
			displayErrorContextualMenu(true)
		}
	}

	return (
		<Style
			onMouseLeave={() => displaySecondaryContextualMenu(false)}
			$left={secondaryContextualMenuPosition.left}
			$right={secondaryContextualMenuPosition.right}
			$top={secondaryContextualMenuPosition.top}
			$bottom={secondaryContextualMenuPosition.bottom}
			$height={secondaryContextualMenuHeight}>
		{
			channels ?
			<ScrollBar>
			{
				channels.map((channel, index) => (
					<Section key={"channelSection" + index} onClick={() => handleInviteClickEvent(channel)}>
						<SectionName> 
							{channel.name}
						</SectionName>
					</Section>
				))
			}
			</ScrollBar>
			:
			<ErrorRequest />
		}
		</Style>
	)
}

export default SecondaryContextualMenu