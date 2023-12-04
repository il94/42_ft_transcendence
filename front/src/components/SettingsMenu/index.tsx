import { Dispatch, SetStateAction } from "react"

import {
	Button,
	ButtonWrapper,
	CloseButton,
	Avatar,
	PseudoStyle,
	Setting,
	SettingInfo,
	SettingTtile,
	Style,
	TwoFA,
	UserName
} from "./style"

import Icon from "../../componentsLibrary/Icon"

import CloseIcon from "../../assets/close.png"

type PropsSettingsMenu = {
	userData: {
		username: string,
		avatar: string
	}
	displaySettingsMenu: Dispatch<SetStateAction<boolean>>,
}

function SettingsMenu({ displaySettingsMenu, userData }: PropsSettingsMenu) {

	return (
		<PseudoStyle>
			<Style>
				<ButtonWrapper>
					<CloseButton>
						<Icon src={CloseIcon} size={24}
							onClick={() => displaySettingsMenu(false)}
							alt="Close button" title="Close" />
					</CloseButton>
				</ButtonWrapper>
				<Setting>
					<Avatar src={userData.avatar}/>
					<Button>
						Modify
					</Button>
				</Setting>
				<Setting>
					<SettingInfo>
						<SettingTtile>
							Username
						</SettingTtile>
						<UserName>
							{userData.username}
						</UserName>
					</SettingInfo>
					<Button>
						Modify
					</Button>
				</Setting>
				<Setting>
					<SettingInfo>
						<SettingTtile>
							2FA
						</SettingTtile>
						<TwoFA>
							Able
						</TwoFA>
					</SettingInfo>
					<Button>
						Disable
					</Button>
				</Setting>
			</Style>
		</PseudoStyle>
	)
}

export default SettingsMenu