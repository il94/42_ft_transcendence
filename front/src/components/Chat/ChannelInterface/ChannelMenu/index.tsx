import {
	ChangeEvent,
	Dispatch, 
	FormEvent, 
	SetStateAction,
	useState
} from "react"

import {
	Avatar,
	Setting,
	SettingTtile,
	Style,
	ChannelName,
	ButtonsWrapper,
	CreateChannelForm,
	AvatarWrapper,
	ChannelNameWrapper,
	ErrorMessage
} from "./style"

import Button from "../../../../componentsLibrary/Button"
import Icon from "../../../../componentsLibrary/Icon"
import IconUploadFile, { HiddenInput } from "../../../../componentsLibrary/IconUploadFile"

import RemoveIcon from "../../../../assets/close.png"
import DefaultChannelIcon from "../../../../assets/default_channel.png"
import { Channel } from "../../../../utils/types"
import { channelStatus } from "../../../../utils/status"

type PropsChannelMenu = {
	channel: Channel,
	updateChannel?: boolean,
	displayChannelInterface: Dispatch<SetStateAction<{
		display: boolean,
		updateChannel?: boolean
	}>>,
	setChannelNameOverview: Dispatch<SetStateAction<string>>
}

function ChannelMenu({ channel, updateChannel, displayChannelInterface, setChannelNameOverview } : PropsChannelMenu) {

	function handleSubmit(event: FormEvent<HTMLFormElement>) {

		event.preventDefault()

		if (inputName.length === 0)
			setError({
				message: "Insert name",
				state: true
			})
		else
		{
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
	}

	type PropsError = {
		message: string,
		state: boolean
	}

	const [error, setError] = useState<PropsError>({ message: '', state: false })

	const [inputName, setInputName] = useState<string>(updateChannel ? channel.name : '')
	function handleInputNameChange(event: ChangeEvent<HTMLInputElement>) {
		const value = event.target.value
		if (value.length > 8 )
			setError({
				message: "8 characters max",
				state: true
			})
		else
		{
			setInputName(value)
			setError({
				message: '',
				state: false
			})
			setChannelNameOverview(value)
		}
	}

	const [channelType, setChannelType] = useState<string>(updateChannel ? channel.type : channelStatus.PUBLIC)
	function handleButtonClick() {
		if (channelType === channelStatus.PUBLIC)
			setChannelType(channelStatus.PROTECTED)
		else if (channelType === channelStatus.PROTECTED)
			setChannelType(channelStatus.PRIVATE)
		else
			setChannelType(channelStatus.PUBLIC)
	}

	const [inputPassword, setInputPassword] = useState<string | undefined>(updateChannel ? channel.password : '')
	function handleInputPasswordChange(event: ChangeEvent<HTMLInputElement>) {
		setInputPassword(event.target.value)
	}

	const [avatarUploaded, setAvatarUploaded] = useState<string>(updateChannel ? channel.avatar : DefaultChannelIcon)
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
					<ChannelNameWrapper>
						<ChannelName
							onInput={handleInputNameChange}
							onBlur={() => setError({ message: '', state: false})}
							type="text"
							value={inputName}
							$error={error.state} />
						<ErrorMessage>
							{error.message}
						</ErrorMessage>
					</ChannelNameWrapper>
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
					channelType === channelStatus.PROTECTED ?
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
							htmlFor="uploadAvatarChannel" fontSize={13}
							alt="Upload icon" title="Upload image">
								&nbsp;Upload&nbsp;
						</IconUploadFile>
						<Icon
							onClick={() => setAvatarUploaded(DefaultChannelIcon)}
							type="button" src={RemoveIcon} size={23}
							alt="Remove icon" title="Remove image" />
						<Avatar
							src={avatarUploaded} htmlFor="uploadAvatarChannel"
							title="Upload image" />
						<HiddenInput onChange={handleAvatarUpload}
							id="uploadAvatarChannel" type="file" accept="image/*" />
					</AvatarWrapper>
				</Setting>
				<ButtonsWrapper>
					<Button
						onClick={() => displayChannelInterface({ display: false })}
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

export default ChannelMenu