import { Avatar, SettingTtile, Style } from "./style"
import { HiddenInput } from "../../../componentsLibrary/IconUploadFile"
import { ChangeEvent, Dispatch, SetStateAction } from "react"

// import DefaultBlackAvatar from "../assets/default_black.png"
// import DefaultBlueAvatar from "../assets/default_blue.png"
// import DefaultGreenAvatar from "../assets/default_green.png"
// import DefaultPinkAvatar from "../assets/default_pink.png"
// import DefaultPurpleAvatar from "../assets/default_purple.png"
// import DefaultRedAvatar from "../assets/default_red.png"
// import DefaultYellowAvatar from "../assets/default_yellow.png"

// menu qui permettrait de choisir un avatar parmis ceux par defaut, ou d'en upload un 

type PropsSelectAvatar = {
	avatar: string,
	setAvatar: Dispatch<SetStateAction<string>>
}

function SelectAvatar({ avatar, setAvatar }: PropsSelectAvatar) {

	function handleAvatarUpload(event: ChangeEvent<HTMLInputElement>) {

		const avatar = event.target.files?.[0]
		if (avatar) {
			const reader = new FileReader()

			reader.onloadend = () => {
				const imageDataUrl = reader.result
				if (typeof imageDataUrl === 'string')
					setAvatar(imageDataUrl);
			}

			reader.onerror = () => {
				console.error("error")
				setAvatar('');
			}
			reader.readAsDataURL(avatar)
		}

	}

	return (
		<Style>
			<SettingTtile>
				Avatar
			</SettingTtile>
			<Avatar
				src={avatar} htmlFor="uploadAvatarUser"
				title="Upload image" />
			<HiddenInput onChange={handleAvatarUpload}
				id="uploadAvatarUser" type="file" accept="image/*" />
		</Style>
	)
}

export default SelectAvatar