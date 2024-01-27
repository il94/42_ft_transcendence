import {
	ChangeEvent,
	Dispatch,
	FormEvent,
	SetStateAction,
	useContext,
	useState
} from "react"
import axios from "axios"

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

import Button from "../../../componentsLibrary/Button"
import Icon from "../../../componentsLibrary/Icon"
import IconUploadFile, { HiddenInput } from "../../../componentsLibrary/IconUploadFile"
import ErrorRequestMessage from "../../../componentsLibrary/ErrorRequestMessage"

import InteractionContext from "../../../contexts/InteractionContext"
import AuthContext from "../../../contexts/AuthContext"

import { capitalize } from "../../../utils/functions"

import { Channel } from "../../../utils/types"
import { channelStatus, chatWindowStatus } from "../../../utils/status"

import RemoveIcon from "../../../assets/close.png"
import DefaultChannelIcon from "../../../assets/default_channel.png"

type PropsChannelInterface = {
	setBannerName: Dispatch<SetStateAction<string>>,
	chatWindowState: chatWindowStatus,
	setChatWindowState: Dispatch<SetStateAction<chatWindowStatus>>
}

function ChannelInterface({ setBannerName, chatWindowState, setChatWindowState }: PropsChannelInterface) {

	const { token, url } = useContext(AuthContext)!
	const { userAuthenticate, setUserAuthenticate, channelTarget, setChannelTarget } = useContext(InteractionContext)!

	const [error, setError] = useState<boolean>(false)

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {

		event.preventDefault()
		if (name.value.length === 0) {
			setName({
				value: '',
				error: true,
				errorMessage: "Insert name",
			})
			return
		}
		if (name.error)
			return

		try {
			if (chatWindowState === chatWindowStatus.UPDATE_CHANNEL) {
				if (channelTarget) {
					const newDatas: any = {
						name: name.value !== channelTarget.name ? name.value : channelTarget.name,
						type: channelType !== channelTarget.type ? channelType : channelTarget.type,
						password: password !== channelTarget.password ? password : channelTarget.password,
						avatar: avatar !== channelTarget.avatar ? avatar : channelTarget.avatar
					}		

					await axios.patch(`http://${url}:3333/channel/${channelTarget.id}`, newDatas,
					{
						headers: {
							'Authorization': `Bearer ${token}`
						}
					})
				}
				else
					throw new Error
			}
			else if (chatWindowState === chatWindowStatus.CREATE_CHANNEL) {

				const newDatas: any = {
					name: name.value,
					type: channelType,
					password: password,
					avatar: avatar
				}		

				const postChannelResponse = await axios.post(`http://${url}:3333/channel`, newDatas,
				{
					headers: {
						'Authorization': `Bearer ${token}`
					}
				})

				const newChannel: Channel = {
					id: postChannelResponse.data.id,
					...newDatas,
					messages: [],
					owner: userAuthenticate,
					administrators: [
						userAuthenticate
					],
					members: [
						userAuthenticate
					],
					mutedUsers: []
				}

				setUserAuthenticate((prevState) => ({
					...prevState,
					channels: [...prevState.channels, newChannel]
				}))
				
				setChannelTarget(newChannel)
			}
		}
		catch (error) {
			console.log(error)
			setError(true)
		}
	}

	/* ================================ NAME ==================================== */

	type PropsName = {
		value: string,
		error: boolean,
		errorMessage?: string
	}

	const [name, setName] = useState<PropsName>({
		value: channelTarget && chatWindowState === chatWindowStatus.UPDATE_CHANNEL ? channelTarget.name : '',
		error: false,
		errorMessage: ''
	})
	function handleNameChange(event: ChangeEvent<HTMLInputElement>) {
		const value = event.target.value
		if (value.length > 8) {
			setName((prevState) => ({
				...prevState,
				error: true,
				errorMessage: "8 characters max"
			}))
		}
		else {
			if (value.length === 0) {
				setName({
					value: value,
					error: true,
					errorMessage: "Insert name",
				})
			}
			else {
				setName({
					value: value,
					error: false
				})
			}
			setBannerName(value)
		}
	}

	function handleNameBlur(event: ChangeEvent<HTMLInputElement>) {
		const value = event.target.value
		if (value.length === 0) {
			setName({
				value: value,
				error: true,
				errorMessage: "Insert name",
			})
		}
		else {
			setName({
				value: value,
				error: false
			})
		}
	}

	/* =========================== CHANNEL TYPE ================================= */

	const [channelType, setChannelType] = useState<channelStatus>(
		channelTarget && chatWindowState === chatWindowStatus.UPDATE_CHANNEL ?
			channelTarget.type
			:
			channelStatus.PUBLIC
	)
	function handleButtonClick() {
		if (channelType === channelStatus.PUBLIC)
			setChannelType(channelStatus.PROTECTED)
		else if (channelType === channelStatus.PROTECTED)
			setChannelType(channelStatus.PRIVATE)
		else
			setChannelType(channelStatus.PUBLIC)
	}

	/* ============================== PASSWORD ================================== */

	const [password, setPassword] = useState<string | undefined>(
		channelTarget && chatWindowState === chatWindowStatus.UPDATE_CHANNEL ?
			channelTarget.password ?
			channelTarget.password :
			''
			:
			''
	)
	function handlePasswordChange(event: ChangeEvent<HTMLInputElement>) {
		setPassword(event.target.value)
	}

	/* =============================== AVATAR =================================== */

	const [avatar, setAvatar] = useState<string>(
		channelTarget && chatWindowState === chatWindowStatus.UPDATE_CHANNEL ?
			channelTarget.avatar
			:
			DefaultChannelIcon
	)
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
			{
				!error ?
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
									onInput={handleNameChange}
									onBlur={handleNameBlur}
									type="text"
									value={name.value}
									$error={name.error} />
								<ErrorMessage>
									{name.error && name.errorMessage}
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
								style={{ marginLeft: "auto", marginRight: "5px" }}>
								{capitalize(channelType)}
							</Button>
						</Setting>
						{
							channelType === channelStatus.PROTECTED ?
								<Setting>
									<SettingTtile>
										Password
									</SettingTtile>
									<ChannelName
										onInput={handlePasswordChange}
										type="text"
										value={password} />
								</Setting>
								:
								<Setting>
									<SettingTtile $disable>
										Password
									</SettingTtile>
									<ChannelName
										onInput={handlePasswordChange}
										type="text"
										value={password}
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
									onClick={() => setAvatar(DefaultChannelIcon)}
									type="button" src={RemoveIcon} size={23}
									alt="Remove icon" title="Remove image" />
								<Avatar
									src={avatar} htmlFor="uploadAvatarChannel"
									title="Upload image" />
								<HiddenInput onChange={handleAvatarUpload}
									id="uploadAvatarChannel" type="file" accept="image/*" />
							</AvatarWrapper>
						</Setting>
						<ButtonsWrapper>
							<Button
								onClick={() => setChatWindowState(chatWindowStatus.CHANNEL)}
								type="button"
								fontSize={14} alt="Cancel icon" title="Cancel" >
								Cancel
							</Button>
							<Button
								type="submit"
								fontSize={14} alt="Create icon" title="Create" >
								{
									chatWindowState === chatWindowStatus.CREATE_CHANNEL ?
										"Create"
										:
										"Update"
								}
							</Button>
						</ButtonsWrapper>
					</CreateChannelForm>
					:
					<ErrorRequestMessage />
			}
		</Style>
	)
}

export default ChannelInterface