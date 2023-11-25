import { Dispatch, SetStateAction } from "react"

import {
	Button,
	ButtonWrapper,
	CloseButton,
	ProfilePicture,
	PseudoStyle,
	Setting,
	SettingInfo,
	SettingTtile,
	Style,
	TwoFA,
	UserName
} from "./style"

import CloseIcon from "../../assets/close.png"
import Icon from "../../componentsLibrary/Icon"

function SettingsPopup({ displaySettings } : { displaySettings: Dispatch<SetStateAction<boolean>> }) {

	return (
		<PseudoStyle>
		
		<Style>
			<ButtonWrapper>
				<CloseButton>
					<Icon src={CloseIcon} size="24px" onClick={() => displaySettings(false)}
						alt="Close button" title="Close"/>
					</CloseButton>
			</ButtonWrapper>
			<Setting>
				<ProfilePicture />
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
						WWWWWWWW
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

export default SettingsPopup