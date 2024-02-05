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
	Style,
	TwoFAValue
} from "./style"

import SelectAvatar from "./SelectAvatar"
import Button from "../../componentsLibrary/Button"
import InputText from "../../componentsLibrary/InputText"

import DisplayContext from "../../contexts/DisplayContext"
import InteractionContext from "../../contexts/InteractionContext"
import AuthContext from "../../contexts/AuthContext"

import {
	ErrorResponse,
	SettingData
} from "../../utils/types"

import {
	emptySetting
} from "../../utils/emptyObjects"

import {
	ErrorMessage,
	VerticalSetting,
	VerticalSettingWrapper,
	VerticalSettingsForm
} from "../../componentsLibrary/SettingsForm/Index"
import CloseButton from "../../componentsLibrary/CloseButton"

type PropsSettingsMenu = {
	displaySettingsMenu: Dispatch<SetStateAction<boolean>>,
	displayTwoFAMenu: Dispatch<SetStateAction<boolean>>
}

function SettingsMenu({ displaySettingsMenu, displayTwoFAMenu }: PropsSettingsMenu) {

	const { token, url } = useContext(AuthContext)!
	const { userAuthenticate, setUserAuthenticate } = useContext(InteractionContext)!
	const { displayPopupError } = useContext(DisplayContext)!

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		try {
			event.preventDefault()
			if (username.value.length === 0) {
				if (username.value.length === 0) {
					setUsername({
						value: '',
						error: true,
						errorMessage: "Insert username",
					})
				}
				return
			}

			if (username.error || password.error)
				return

			const newDatas: any = {}

			if (username.value !== userAuthenticate.username)
				newDatas.username = username.value
			if (password.value)
				newDatas.hash = password.value
			if (avatar !== userAuthenticate.avatar)
				newDatas.avatar = avatar

			if (Object.keys(newDatas).length !== 0)
			{
				await axios.patch(`http://${url}:3333/user/me`, newDatas,
				{
					headers: {
						'Authorization': `Bearer ${token}`
					}
				})
				
				setUserAuthenticate((prevState) => ({
					...prevState,
					...newDatas,
				}))
			}

			displaySettingsMenu(false)
		}
		catch (error) {
			if (axios.isAxiosError(error))
			{
				const axiosError = error as AxiosError<ErrorResponse>
				const { statusCode } = axiosError.response?.data!
				if (statusCode === 403)
				{
					setUsername((prevState: SettingData) => ({
						...prevState,
						error: true,
						errorMessage: "Invalid username"
					}))
				}
				else
				{
					displayPopupError({ display: true })
					displaySettingsMenu(false)
				}
			}
			else
			{
				displayPopupError({ display: true })
				displaySettingsMenu(false)
			}
		}
	}

	/* ============================== USERNAME ================================== */

	const [username, setUsername] = useState<SettingData>({
		value: userAuthenticate.username,
		error: false,
		errorMessage: ''
	})

	function handleInputUsernameChange(event: ChangeEvent<HTMLInputElement>) {
		const value = event.target.value
		if (!value) {
			setUsername({
				value: value,
				error: true,
				errorMessage: "Username cannot be empty"
			})
		}
		else if (value.length > 8) {
			setUsername((prevState: SettingData) => ({
				...prevState,
				error: true,
				errorMessage: "Username must not exceed 8 characters"
			}))
		}
		else if (/\d/.test(value)) {
			setUsername((prevState: SettingData) => ({
				...prevState,
				error: true,
				errorMessage: "Username must not contain digits",
			}))
		}
		else if (/[A-Z]/.test(value)) {
			setUsername((prevState: SettingData) => ({
				...prevState,
				error: true,
				errorMessage: "Username must not contain uppercase",
			}))
		}
		else if (!/^[a-z]+$/.test(value)) {
			setUsername((prevState: SettingData) => ({
				...prevState,
				error: true,
				errorMessage: "Username can't contain special characters",
			}))
		}
		else {
			setUsername({
				value: value,
				error: false
			})
		}
	}

	function handleInputUsernameBlur() {
		setUsername((prevState: SettingData) => ({
			...prevState,
			error: false
		}))
	}

	/* ============================== PASSWORD ================================== */

	const [password, setPassword] = useState<SettingData>(emptySetting)

	function handleInputPasswordChange(event: ChangeEvent<HTMLInputElement>) {
		const value = event.target.value

		if (value.length < 8 ||
			!/[A-Z]/.test(value) ||
			!/[a-z]/.test(value) ||
			!/\d/.test(value) ||
			!/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(value))
		{
			let errorMessages: string[] = []
			if (value.length === 0) {
				errorMessages.push("Password cannot be empty")
			}
			else if (value.length < 8) {
				errorMessages.push("Password must be at least 8 characters long")
			}
			if (!/[A-Z]/.test(value)) {
				errorMessages.push("Password must contain one uppercase")
			}
			if (!/[a-z]/.test(value)) {
				errorMessages.push("Password must contain one lowercase")
			}
			if (!/\d/.test(value)) {
				errorMessages.push("Password must contain one number")
			}
			if (!/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(value)) {
				errorMessages.push("Password must contain one special character")
			}
			setPassword({
				value: value,
				error: true,
				errorMessage: errorMessages
			})
		}
		else {
			setPassword({
				value: value,
				error: false
			})
		}
	}

	const [showPassword, setShowPassword] = useState<boolean>(false)
	const [placeHolder, setPlaceHolder] = useState<string>("New password")

	/* ================================= 2FA ==================================== */

	const twoFA = userAuthenticate.twoFA

	/* =============================== AVATAR ================================== */

	const [avatar, setAvatar] = useState<string>(userAuthenticate.avatar)

	/* ========================================================================== */

	const { zSettingsIndex, setZSettingsIndex, zMaxIndex } = useContext(DisplayContext)!

	useEffect(() => {
		setZSettingsIndex(zMaxIndex + 1)
	}, [])

	return (
		<Style
			onClick={() => setZSettingsIndex(zMaxIndex + 1)}
			$zIndex={zSettingsIndex}>
			<CloseButton closeFunction={displaySettingsMenu} />
			<div style={{ height: "5px" }} />
				<VerticalSettingsForm
					onSubmit={handleSubmit}
					autoComplete="off"
					spellCheck="false">
					<VerticalSetting fontSize={15} $alignItems="start">
						Username
						<VerticalSettingWrapper>
						<InputText
							onChange={handleInputUsernameChange}
							onBlur={handleInputUsernameBlur}
							type="text" value={username.value as string}
							fontSize={16}
							$error={username.error} />
						<ErrorMessage fontSize={10} >
							{username.error && username.errorMessage}
						</ErrorMessage>
						</VerticalSettingWrapper>
					</VerticalSetting>
					<VerticalSetting fontSize={15} $alignItems="start">
						Password
						<VerticalSettingWrapper>
						<InputText
							onChange={handleInputPasswordChange}
							onClick={() => setPlaceHolder('')}
							onBlur={() => setPlaceHolder("New password")}
							type={showPassword ? "text" : "password"}
							placeholder={placeHolder}
							value={password.value as string}
							fontSize={16}
							$error={password.error} />
						{
							password.errorMessage ?
							<>
							{
								Array.isArray(password.errorMessage) ?
								<>
								{
									(password.errorMessage as string[]).map((errorMessage, index) => {
										return (
											<ErrorMessage
												key={"settingsErrorMessage" + index}
												fontSize={10} >
												{errorMessage}
											</ErrorMessage>)
										}
									)
								}
								</>
								:
								<ErrorMessage fontSize={10} >
									{password.errorMessage}
								</ErrorMessage>
							}
							</>
							:
							<div style={{ height: "15px" }} />
						}
						<Button
							onClick={() => setShowPassword(!showPassword)}
							type="button" width={200}
							alt="Show password button"
							title={showPassword ? "Hide password" : "Show password"}
							style={{ alignSelf: "center", marginBottom: "7.5px" }}>
							{
								showPassword ?
									"Hide password"
									:
									"Show password"
							}
						</Button>
						</VerticalSettingWrapper>
					</VerticalSetting>
					<VerticalSetting fontSize={15} $alignItems="start">
						2FA
						<VerticalSettingWrapper>
						<TwoFAValue>
							{ twoFA ? "Enable" : "Disable" }
						</TwoFAValue>
						<div style={{ height: "15px" }} />
						<Button
							onClick={() => displayTwoFAMenu(true)}
							type="button" width={200}
							alt="Set 2FA button"
							title={ twoFA ? "Disable" : "Enable" }
							style={{ alignSelf: "center" }}>
							{ twoFA ? "Disable" : "Enable" }
						</Button>
						</VerticalSettingWrapper>
					</VerticalSetting>
					<VerticalSetting>
						<SelectAvatar
							avatar={avatar}
							setAvatar={setAvatar} />
					</VerticalSetting>
						<Button
							type="submit"
							fontSize={19}
							alt="Save button" title="Save changes">
							Save
						</Button>
					<div style={{ height: "5px" }} />
				</VerticalSettingsForm>
		</Style>
	)
}

export default SettingsMenu