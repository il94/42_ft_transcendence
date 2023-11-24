import { Dispatch, SetStateAction } from "react"

import { Button,
	ButtonWrapper,
	CloseButton,
	ProfilePicture,
	Setting,
	SettingInfo,
	SettingTtile,
	Style,
	TwoFA,
	UserName
} from "./style"

import CloseIcon from "../../assets/base.png"

function SettingsPopup({ displaySettings } : { displaySettings: Dispatch<SetStateAction<boolean>> }) {

	return (
		<Style>
			<ButtonWrapper>
				<CloseButton src={CloseIcon} onClick={() => displaySettings(false)}
					alt="Close button" title="Close" />
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
	)

}

export default SettingsPopup