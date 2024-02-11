import { Avatar, SettingTtile, Style } from "./style"
import { HiddenInput } from "../../../componentsLibrary/IconUploadFile"
import { ChangeEvent, Dispatch, SetStateAction, useContext } from "react"
import axios from "axios"
import AuthContext from "../../../contexts/AuthContext"

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

	const { token, url } = useContext(AuthContext)!


	async function uploadAvatar(avatarr: any) {
		try {
							
			console.log("AVATAR  = ", avatarr)

			const formData = new FormData();
			formData.append('file', avatarr);
			

			await axios.post(`http://${url}:3333/user/upload`, formData,
			{
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'multipart/form-data'
				}
			})
		}
		catch (error) {
			console.log(error)
		}
	}

	async function handleAvatarUpload(event: ChangeEvent<HTMLInputElement>) {


		const avatarr = event.target.files?.[0]
		if (avatarr) {
			const reader = new FileReader()

			reader.onloadend = () => {
				const imageDataUrl = reader.result
				if (typeof imageDataUrl === 'string')
				{
					setAvatar(imageDataUrl);
					uploadAvatar(avatarr)
				}
			}

			reader.onerror = () => {
				console.error("error")
				setAvatar('');
			}
			reader.readAsDataURL(avatarr)
		}

	}

	return (
		<Style>
			<SettingTtile>
				Avatar
			</SettingTtile>
			<Avatar
				src={avatar} htmlFor="uploadAvatarUser" tabIndex={0}
				title="Upload image" />
			<HiddenInput onChange={handleAvatarUpload}
				id="uploadAvatarUser" type="file" accept="image/*" />
		</Style>
	)
}

export default SelectAvatar