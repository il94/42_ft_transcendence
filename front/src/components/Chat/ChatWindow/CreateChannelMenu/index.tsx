import { ChangeEvent, useState } from "react";

import {
	Avatar,
	Setting,
	SettingTtile,
	Style,
	ChannelName,
	ButtonsWrapper,
	SettingsWrapper
} from "./style";

import Button from "../../../../componentsLibrary/Button";

function CreateChannelMenu() {

	const [inputName, setInputName] = useState<string>('')
	function handleInputNameChange(event: ChangeEvent<HTMLInputElement>) {
		setInputName(event.target.value)
	}

	const [channelType, setChannelType] = useState<string>('public')
	function handleButtonClick() {
		if (channelType === "public")
			setChannelType("protected")
		else if (channelType === "protected")
			setChannelType("private")
		else
			setChannelType("public")
	}

	const [inputPassword, setInputPassword] = useState<string>('')
	function handleInputPasswordChange(event: ChangeEvent<HTMLInputElement>) {
		setInputPassword(event.target.value)
	}

	return (
		<Style>
			<SettingsWrapper>
				<Setting>
					<SettingTtile>
						Name
					</SettingTtile>
					<ChannelName
						onInput={handleInputNameChange}
						value={inputName}
						type="text"
						maxLength={8} />
				</Setting>
				<Setting>
					<SettingTtile>
						Type
					</SettingTtile>
					<Button
						onClick={handleButtonClick}
						fontSize={13}
						style={{marginLeft: "auto", marginRight: "5px"}}
						>
						{channelType}
					</Button>
				</Setting>
				{
					channelType === "protected" ?
					<Setting>
						<SettingTtile>
							Password
						</SettingTtile>
						<ChannelName
							onInput={handleInputPasswordChange}
							value={inputPassword}
							type="text" />
					</Setting>
					:
					<Setting>
						<SettingTtile $disable>
							Password
						</SettingTtile>
						<ChannelName
							onInput={handleInputPasswordChange}
							value={inputPassword}
							type="text"
							$disable
							readOnly />
					</Setting>
			}
			<Setting>
				<SettingTtile>
					Avatar
				</SettingTtile>
				<Avatar />
			</Setting>
			</SettingsWrapper>
			<ButtonsWrapper>
				<Button fontSize={14}>
					Cancel
				</Button>
				<Button fontSize={14}>
					Create
				</Button>
			</ButtonsWrapper>
		</Style>
	)
}

export default CreateChannelMenu