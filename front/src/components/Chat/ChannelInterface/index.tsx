import {
	ChangeEvent,
	Dispatch,
	FormEvent,
	SetStateAction,
	useContext,
	useEffect,
	useState
} from "react"
import axios, { AxiosError } from "axios"

import {
	Avatar,
	Style,
	ButtonsWrapper
} from "./style"

import Button from "../../../componentsLibrary/Button"
import Icon from "../../../componentsLibrary/Icon"
import IconUploadFile, { HiddenInput } from "../../../componentsLibrary/IconUploadFile"
import InputText from "../../../componentsLibrary/InputText"
import {
	VerticalSettingWrapper,
	VerticalSetting,
	VerticalSettingsForm,
	HorizontalSettingWrapper,
	ErrorMessage
} from "../../../componentsLibrary/SettingsForm/Index"

import InteractionContext from "../../../contexts/InteractionContext"
import AuthContext from "../../../contexts/AuthContext"
import DisplayContext from "../../../contexts/DisplayContext"

import {
	capitalize
} from "../../../utils/functions"

import {
	Channel,
	ErrorResponse,
	SettingData
} from "../../../utils/types"

import {
	channelStatus,
	chatWindowStatus
} from "../../../utils/status"

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
	const { displayPopupError } = useContext(DisplayContext)!

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		try {
			event.preventDefault()
			if (!name.value) {
				setName({
					value: '',
					error: true,
					errorMessage: "Insert name",
				})
				return
			}
			else if (!password.value && channelType === channelStatus.PROTECTED) {
				setPassword({
					value: '',
					error: true,
					errorMessage: "Insert password",
				})
				return
			}

			if (name.error || password.error)
				return

			if (chatWindowState === chatWindowStatus.UPDATE_CHANNEL) {
				if (!channelTarget)
					throw new Error

				const newDatas: any = {}

				if (name.value !== channelTarget.name)
					newDatas.name = name.value
				if (channelType !== channelTarget.type)
					newDatas.type = channelType
				if (password.value && channelType == channelStatus.PROTECTED)
					newDatas.hash = password.value
				if (avatar !== channelTarget.avatar)
					newDatas.avatar = avatar

				if (Object.keys(newDatas).length !== 0) {
					await axios.patch(`http://${url}:3333/channel/${channelTarget.id}`, newDatas, {
						headers: {
							'Authorization': `Bearer ${token}`
						}
					})
				}
				else
					setChatWindowState(chatWindowStatus.CHANNEL)
			}
			else if (chatWindowState === chatWindowStatus.CREATE_CHANNEL) {

				const newDatas: any = {
					name: name.value,
					type: channelType,
					hash: password.value,
					avatar: avatar
				}

				const postChannelResponse = await axios.post(`http://${url}:3333/channel`, newDatas, {
					headers: {
						'Authorization': `Bearer ${token}`
					}
				})

				const newChannel: Channel = {
					id: postChannelResponse.data.id,
					...newDatas,
					messages: [],
					members: [],
					administrators: [],
					owner: userAuthenticate,
					mutedUsers: [],
					banneds: []
				}

				setUserAuthenticate((prevState) => ({
					...prevState,
					channels: [...prevState.channels, newChannel]
				}))

				setChannelTarget(newChannel)
			}
		}
		catch (error) {
			if (axios.isAxiosError(error)) {
				const axiosError = error as AxiosError<ErrorResponse>
				const { statusCode, message } = axiosError.response?.data!
				if (statusCode === 403 || statusCode === 404)
					displayPopupError({ display: true, message: message })
				else
					displayPopupError({ display: true })
			}
			else
				displayPopupError({ display: true })
		}
	}

	/* ================================ NAME ==================================== */

	const [name, setName] = useState<SettingData>({
		value: channelTarget && chatWindowState === chatWindowStatus.UPDATE_CHANNEL ? channelTarget.name : '',
		error: false,
		errorMessage: ''
	})

	function handleInputNameChange(event: ChangeEvent<HTMLInputElement>) {
		const value = event.target.value
		if (!value.length) {
			setName({
				value: value,
				error: true,
				errorMessage: "Name cannot be empty"
			})
		}
		else if (value.length > 8) {
			setName((prevState: SettingData) => ({
				...prevState,
				error: true,
				errorMessage: "8 characters max"
			}))
		}
		else {
			setName({
				value: value,
				error: false
			})
			setBannerName(value)
		}
	}

	function handleInputNameBlur() {
		setName((prevState: SettingData) => ({
			...prevState,
			error: false
		}))
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

	const [password, setPassword] = useState<SettingData>({
		value: '',
		error: false,
		errorMessage: ''
	})

	function handleInputPasswordChange(event: ChangeEvent<HTMLInputElement>) {
		const value = event.target.value
		if (!value.length) {
			setPassword({
				value: value,
				error: true,
				errorMessage: "Password cannot be empty"
			})
		}
		else {
			setPassword({
				value: value,
				error: false
			})
		}
	}

	function handleInputPasswordBlur() {
		setPassword((prevState: SettingData) => ({
			...prevState,
			error: false
		}))
	}

	useEffect(() => {
		if (channelType === channelStatus.PUBLIC
			|| channelType === channelStatus.PRIVATE)
		setPassword({
			value: '',
			error: false
		})
	}, [channelType])

	const [placeHolder, setPlaceHolder] = useState<string>('')

	useEffect(() => {
		if (chatWindowState === chatWindowStatus.UPDATE_CHANNEL
			&& channelType === channelStatus.PROTECTED)
			setPlaceHolder("Old password")
		else
			setPlaceHolder("No password")
	}, [])

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

	/* ========================================================================== */

	return (
		<Style>
			<VerticalSettingsForm
				onSubmit={handleSubmit}
				autoComplete="off"
				spellCheck="false">
				<VerticalSetting>
					Name
					<VerticalSettingWrapper>
						<InputText
							onChange={handleInputNameChange}
							onBlur={handleInputNameBlur}
							type="text" value={name.value as string}
							width={120}
							fontSize={16}
							$error={name.error} />
						<ErrorMessage
							fontSize={10}>
							{name.error && name.errorMessage}
						</ErrorMessage>
					</VerticalSettingWrapper>
				</VerticalSetting>
				<VerticalSetting>
					Type
					<Button
						onClick={handleButtonClick}
						type="button"
						fontSize={13} alt="Type channel icon" title="Change type" >
						{capitalize(channelType)}
					</Button>
				</VerticalSetting>
				<VerticalSetting $disable={channelType !== channelStatus.PROTECTED}>
					Password
					<VerticalSettingWrapper>
						<InputText
							onInput={handleInputPasswordChange}
							onClick={() => channelType === channelStatus.PROTECTED && setPlaceHolder('')}
							onBlur={() => {
								setPlaceHolder(
									channelTarget && chatWindowState === chatWindowStatus.UPDATE_CHANNEL ?
										"Old password"
										:
										"No password")
								handleInputPasswordBlur()
							}}
							type="text"
							placeholder={placeHolder}
							value={password.value}
							width={120}
							fontSize={16}
							$disable={channelType !== channelStatus.PROTECTED}
							readOnly={channelType !== channelStatus.PROTECTED} />
						<ErrorMessage
							fontSize={10}>
							{password.error && password.errorMessage}
						</ErrorMessage>
					</VerticalSettingWrapper>
				</VerticalSetting>
				<VerticalSetting>
					Avatar
					<HorizontalSettingWrapper $width={155}>
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
					</HorizontalSettingWrapper>
				</VerticalSetting>
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
			</VerticalSettingsForm>
		</Style>
	)
}

export default ChannelInterface