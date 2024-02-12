import { Avatar, SettingTtile, Style } from "./style"
import { HiddenInput } from "../../../componentsLibrary/IconUploadFile"
import { ChangeEvent, Dispatch, SetStateAction, useContext, useState } from "react"
import axios from "axios"
import AuthContext from "../../../contexts/AuthContext"
import Button from "../../../componentsLibrary/Button"
import { SettingAvatar } from "../../../utils/types"

// import DefaultBlackAvatar from "../assets/default_black.png"
// import DefaultBlueAvatar from "../assets/default_blue.png"
// import DefaultGreenAvatar from "../assets/default_green.png"
// import DefaultPinkAvatar from "../assets/default_pink.png"
// import DefaultPurpleAvatar from "../assets/default_purple.png"
// import DefaultRedAvatar from "../assets/default_red.png"
// import DefaultYellowAvatar from "../assets/default_yellow.png"

// menu qui permettrait de choisir un avatar parmis ceux par defaut, ou d'en upload un 

type PropsSelectAvatar = {
	avatar: SettingAvatar,
	setAvatar: Dispatch<SetStateAction<SettingAvatar>>
}

function SelectAvatar({ avatar, setAvatar }: PropsSelectAvatar) {

	async function handleAvatarUpload(event: ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0]
		if (file) {

			const reader = new FileReader()

			reader.onloadend = () => {
				const imageDataUrl = reader.result
				if (typeof imageDataUrl === 'string')
				{
					setAvatar((prevState) => ({
						...prevState,
						toDisplay: imageDataUrl,
						toUpload: file
					}))
				}
			}

			reader.onerror = () => {
				// displaypopup
			}
			reader.readAsDataURL(file)
		}
	}

	return (
		<Style>
			<SettingTtile>
				Avatar
			</SettingTtile>
			<Avatar
				src={avatar.toDisplay} htmlFor="uploadAvatarUser" tabIndex={0}
				title="Upload image" />
			<HiddenInput onChange={handleAvatarUpload}
				id="uploadAvatarUser" type="file" accept="image/*" />
		</Style>
	)
}

export default SelectAvatar