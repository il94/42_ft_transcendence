import { Dispatch, SetStateAction, useContext } from "react"

import { ChannelName, ButtonsWrapper, Style } from "./style"

import Icon from "../../../../componentsLibrary/Icon"

import ChatContext from "../../../../contexts/ChatContext"

import ReduceIcon from "../../../../assets/reduce.png"
import SettingsIcon from "../../../../assets/settings.png"

type PropsBanner = {
	name: string,
	displaySettingsButton: boolean,
	displayUpdateChannelInterface?: Dispatch<SetStateAction<{
		display: boolean,
		updateChannel?: boolean
	}>>
}

function Banner({ name, displaySettingsButton, displayUpdateChannelInterface } : PropsBanner) {

	const { displayChat } = useContext(ChatContext)!

	return (
		<Style>
			<ChannelName>
				{name}
			</ChannelName>
			<ButtonsWrapper>
				<Icon
					onClick={() => displayChat(false)}
					src={ReduceIcon} size={24}
					alt="Reduce button" title="Reduce" />
				{
					displaySettingsButton &&
					<Icon
						onClick={() => displayUpdateChannelInterface && displayUpdateChannelInterface({ display: true, updateChannel: true })}
						src={SettingsIcon} size={24}
						alt="Settings button" title="Settings" />
				}
			</ButtonsWrapper>
		</Style>
	)
}

export default Banner