import { Dispatch, SetStateAction } from "react"

import {
	Avatar,
	PseudoStyle,
	Setting,
	SettingTtile,
	Style,
	SettingValue,
	CloseButtonWrapper,
	SettingsForm,
	SettingsRow
} from "./style"

import Icon from "../../componentsLibrary/Icon"

import CloseIcon from "../../assets/close.png"
import Button from "../../componentsLibrary/Button"

import DefaultBlackAvatar from "../assets/default_black.png"
import DefaultBlueAvatar from "../assets/default_blue.png"
import DefaultGreenAvatar from "../assets/default_green.png"
import DefaultPinkAvatar from "../assets/default_pink.png"
import DefaultPurpleAvatar from "../assets/default_purple.png"
import DefaultRedAvatar from "../assets/default_red.png"
import DefaultYellowAvatar from "../assets/default_yellow.png"


type PropsSettingsMenu = {
	userData: {
		username: string,
		hash: string,
		avatar: string,
		email: string,
		tel: string
	}
	displaySettingsMenu: Dispatch<SetStateAction<boolean>>,
}

function SettingsMenu({ displaySettingsMenu, userData }: PropsSettingsMenu) {

	return (
		<PseudoStyle>
			<Style>
				<CloseButtonWrapper>
					<Icon src={CloseIcon} size={24}
						onClick={() => displaySettingsMenu(false)}
						alt="Close button" title="Close" />
				</CloseButtonWrapper>
				<SettingsForm>
					<SettingsRow>
						<Setting>
							<SettingTtile>
								Username
							</SettingTtile>
							<SettingValue>
								{userData.username}
							</SettingValue>
						</Setting>
						<Setting>
							<SettingTtile>
								Password
							</SettingTtile>
							<SettingValue>
								{/* {userData.hash} */}
								Temporaire
							</SettingValue>
						</Setting>
					</SettingsRow>
					<SettingsRow>
						<Setting>
							<SettingTtile>
								E-mail
							</SettingTtile>
							<SettingValue>
								{userData.email}
							</SettingValue>
						</Setting>
						<Setting>
							<SettingTtile>
								Phone number
							</SettingTtile>
							<SettingValue>
								{userData.tel}
							</SettingValue>
						</Setting>
					</SettingsRow>
					<SettingsRow>
						<Setting>
							<SettingTtile>
								2FA
							</SettingTtile>
							<SettingValue>
								Able
							</SettingValue>
						</Setting>
					</SettingsRow>
					<SettingsRow>
						<Setting>
							<SettingTtile>
								Avatar
							</SettingTtile>
							<Avatar src={userData.avatar}/>
						</Setting>
					</SettingsRow>
					<SettingsRow>
						<Button
							type="submit"
							fontSize={19}
							alt="Save button" title="Save changes">
							Save
						</Button>
					</SettingsRow>
				</SettingsForm>
			</Style>
		</PseudoStyle>
	)
}

export default SettingsMenu