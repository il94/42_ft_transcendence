import { Button, ProfilePicture, Setting, SettingInfo, SettingTtile, Style, TwoFA, UserName } from "./style"

function SettingsPopup() {

	return (
		<Style>
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
			<div style={{ marginTop: "15px"}}/>
		</Style>
	)

}

export default SettingsPopup