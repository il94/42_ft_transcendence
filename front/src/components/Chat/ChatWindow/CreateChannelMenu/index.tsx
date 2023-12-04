import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useState } from "react";

import {
	Avatar,
	Setting,
	SettingTtile,
	Style,
	ChannelName,
	ButtonsWrapper,
	CreateChannelForm,
	AvatarWrapper
} from "./style";

import Button from "../../../../componentsLibrary/Button";
import axios from "axios";
import Icon from "../../../../componentsLibrary/Icon";

import RemoveIcon from "../../../../assets/close.png"
import DefaultChannelIcon from "../../../../assets/default_channel.png"
import IconUploadFile, { HiddenInput } from "../../../../componentsLibrary/IconUploadFile";

type PropsCreateChannelMenu = {
	displayCreateChannelMenu: Dispatch<SetStateAction<boolean>>
}

function CreateChannelMenu({ displayCreateChannelMenu } : PropsCreateChannelMenu) {

	function handleSubmit(event: FormEvent<HTMLFormElement>) {

		event.preventDefault()

		console.log(inputName)
		console.log(channelType)
		console.log(inputPassword)
		/* ============ Temporaire ============== */

		// Creer un Channel avec un truc du style
		// axios.post("http://localhost:3333/channels"), {
		// 		name: inputName,
		// 		avatar: avatarUploaded,
		//		type: channelType,
		// 		hash: inputPassword
		// })
		// .then((response) => console.log(response))
		// .catch((error) => console.log(error))

	}


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

	const [avatarUploaded, setAvatarUploaded] = useState<string>(DefaultChannelIcon)
	function handleAvatarUpload(event: ChangeEvent<HTMLInputElement>) {

		const avatar = event.target.files?.[0]
		if (avatar)
		{
			const reader = new FileReader()

			reader.onloadend = () => {
				const imageDataUrl = reader.result
				if (typeof imageDataUrl === 'string')
					setAvatarUploaded(imageDataUrl);
			}

			reader.onerror = () => {
				console.error("error")
				setAvatarUploaded('');
			}
			reader.readAsDataURL(avatar)
		}

	}


	return (
		<Style>
			<CreateChannelForm
				onSubmit={handleSubmit}
				autoComplete="off"
				spellCheck="false">
				<Setting>
					<SettingTtile>
						Name
					</SettingTtile>
					<ChannelName
						onInput={handleInputNameChange}
						type="text"
						value={inputName}
						maxLength={8} />
				</Setting>
				<Setting>
					<SettingTtile>
						Type
					</SettingTtile>
					<Button
						onClick={handleButtonClick}
						type="button"
						fontSize={13} alt="Type channel icon" title="Change type"
						style={{marginLeft: "auto", marginRight: "5px"}}>
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
							type="text"
							value={inputPassword} />
					</Setting>
					:
					<Setting>
						<SettingTtile $disable>
							Password
						</SettingTtile>
						<ChannelName
							onInput={handleInputPasswordChange}
							type="text"
							value={inputPassword}
							$disable
							readOnly />
					</Setting>
				}
				<Setting>
					<SettingTtile>
						Avatar
					</SettingTtile>
					<AvatarWrapper>
						<IconUploadFile
							htmlFor="upload" fontSize={13}
							alt="Upload icon" title="Upload image">
								&nbsp;Upload&nbsp;
						</IconUploadFile>
						<Icon
							onClick={() => setAvatarUploaded(DefaultChannelIcon)}
							type="button" src={RemoveIcon} size={23}
							alt="Remove icon" title="Remove image" />
						<Avatar
							src={avatarUploaded} htmlFor="upload"
							title="Upload image" />
						<HiddenInput onChange={handleAvatarUpload}
							id="upload" type="file" accept="image/*" />
					</AvatarWrapper>
				</Setting>
				<ButtonsWrapper>
					<Button
						onClick={() => displayCreateChannelMenu(false)}
						type="button"
						fontSize={14} alt="Cancel icon" title="Cancel" >
						Cancel
					</Button>
					<Button
						type="submit"
						fontSize={14} alt="Create icon" title="Create" >
						Create
					</Button>
				</ButtonsWrapper>
			</CreateChannelForm>
		</Style>
	)
}

export default CreateChannelMenu