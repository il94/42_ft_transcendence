import {
	Dispatch,
	SetStateAction,
	useContext
} from "react"
// import axios from "axios"

import { Style } from "./style"

import ScrollBar from "../../../componentsLibrary/ScrollBar"
import Section, { SectionName } from "../../../componentsLibrary/Section"
import ErrorRequestMessage from "../../../componentsLibrary/ErrorRequestMessage"

import InteractionContext from "../../../contexts/InteractionContext"
import DisplayContext from "../../../contexts/DisplayContext"

import { Channel } from "../../../utils/types"

type PropsSecondaryContextualMenu = {
	displaySecondaryContextualMenu: Dispatch<SetStateAction<boolean>>,
	secondaryContextualMenuPosition: {
		left?: number,
		right?: number,
		top?: number,
		bottom?: number
	},
	secondaryContextualMenuHeight: number,
	channels: Channel[] | undefined
}

function SecondaryContextualMenu({ displaySecondaryContextualMenu, secondaryContextualMenuPosition, secondaryContextualMenuHeight, channels }: PropsSecondaryContextualMenu) {

	const { userTarget } = useContext(InteractionContext)!
	const { displayPopupError } = useContext(DisplayContext)!

	async function handleInviteClickEvent(channel: Channel) {
		try {
			if (!channel.members.includes(userTarget)) {
				/* ============ Temporaire ============== */

				// await axios.post(`http://${url}:3333/channel/${channel.id}/users/${userTarget.id}`, userTarget)

				/* ====================================== */
				channel.members.push(userTarget)
			}
		}
		catch (error) {
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
			$height={secondaryContextualMenuHeight}>
			{
				channels ?
					<ScrollBar visible>
						{
							channels.map((channel, index) => (
								<Section
									key={"channelSection" + index}
									onClick={() => handleInviteClickEvent(channel)}>
									<SectionName>
										{channel.name}
									</SectionName>
								</Section>
							))
						}
					</ScrollBar>
					:
					<ErrorRequestMessage />
			}
		</Style>
	)
}

export default SecondaryContextualMenu