import {
	Dispatch,
	SetStateAction
} from "react"

import {
	Avatar,
	SettingTtile,
	Style
} from "./style"

import {
	handleAvatarUpload
} from "../../utils/functions"

import {
	HiddenInput
} from "../../componentsLibrary/IconUploadFile"

import {
	SettingAvatar
} from "../../utils/types"

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
	setAvatar: Dispatch<SetStateAction<SettingAvatar>>,
	displayPopupError?: Dispatch<SetStateAction<{
		display: boolean,
		message?: string
	}>>,
	navigate?: any
}

function SelectAvatar({ avatar, setAvatar, displayPopupError, navigate }: PropsSelectAvatar) {

	return (
		<Style>
			<SettingTtile>
				Avatar
			</SettingTtile>
			<Avatar
				src={avatar.toDisplay} htmlFor="uploadAvatarUser" tabIndex={0}
				title="Upload image" />
			<HiddenInput onChange={(event) => handleAvatarUpload(event, setAvatar, displayPopupError, navigate)}
				id="uploadAvatarUser" type="file" accept="image/*" />
		</Style>
	)
}

export default SelectAvatar