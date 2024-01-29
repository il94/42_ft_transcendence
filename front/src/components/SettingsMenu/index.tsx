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
	Setting,
	SettingTtile,
	Style,
	CloseButtonWrapper,
	SettingsForm,
	ErrorMessage,
	TwoFAValue
} from "./style"

import SelectAvatar from "./SelectAvatar"
import Icon from "../../componentsLibrary/Icon"
import Button from "../../componentsLibrary/Button"
import InputText from "../../componentsLibrary/InputText"
import ScrollBar from "../../componentsLibrary/ScrollBar"

import DisplayContext from "../../contexts/DisplayContext"
import InteractionContext from "../../contexts/InteractionContext"
import AuthContext from "../../contexts/AuthContext"

import {
	ErrorResponse,
	SettingData
} from "../../utils/types"
import { emptySetting } from "../../utils/emptyObjects"

import CloseIcon from "../../assets/close.png"

type PropsSettingsMenu = {
	displaySettingsMenu: Dispatch<SetStateAction<boolean>>,
	displayTwoFAMenu: Dispatch<SetStateAction<boolean>>,
	setTwoFACodeQR: Dispatch<SetStateAction<string>>
}

function SettingsMenu({ displaySettingsMenu, displayTwoFAMenu, setTwoFACodeQR }: PropsSettingsMenu) {

	const { token, url } = useContext(AuthContext)!
	const { userAuthenticate, setUserAuthenticate } = useContext(InteractionContext)!

	async function handleSubmitTWOfa(event: FormEvent<HTMLFormElement>) {
		try {

			console.log("SUBMIT")

			event.preventDefault()

			await axios.patch(`http://${url}:3333/auth/2fa/enable`, {
				twoFACode: QRcodeValue
			},
			{
				headers: {
					'Authorization': `Bearer ${token}`
				}
			})
		}
		catch (error) {

			// afficher correctement la gestion d'erreur

			console.log(error)
		}
	}

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		try {

			event.preventDefault()
			if (username.value.length === 0 ||
				email.value.length === 0 ||
				phoneNumber.value.length === 0) {
				if (username.value.length === 0) {

					setUsername({
						value: '',
						error: true,
						errorMessage: "Insert username",
					})
				}
				if (email.value.length === 0) {
					setEmail({
						value: '',
						error: true,
						errorMessage: "Insert email",
					})
				}
				if (phoneNumber.value.length === 0) {
					setPhoneNumber({
						value: '',
						error: true,
						errorMessage: "Insert phone number",
					})
				}
				return
			}

			if (username.error || password.error || email.error || phoneNumber.error)
				return

			const newDatas: any = {}

			if (username.value !== userAuthenticate.username)
				newDatas.username = username.value
			if (password.value)
				newDatas.hash = password.value
			if (email.value !== userAuthenticate.email)
				newDatas.email = email.value
			if (phoneNumber.value !== userAuthenticate.phoneNumber)
				newDatas.phoneNumber = phoneNumber.value
			if (twoFA !== userAuthenticate.twoFA)
				newDatas.twoFA = twoFA
			if (avatar !== userAuthenticate.avatar)
				newDatas.avatar = avatar

			if (Object.keys(newDatas).length !== 0)
			{
				await axios.patch(`http://${url}:3333/user/${userAuthenticate.id}`, newDatas,
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
				if (statusCode === 409)
				{
					setEmail((prevState: SettingData) => ({
						...prevState,
						error: true,
						errorMessage: "Invalid email"
					}))
				}
				// else
					// setErrorRequest(true)
			}
			// else
				// setErrorRequest(true)
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
		if (value.length === 0) {
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

	/* =============================== EMAIL ==================================== */

	const [email, setEmail] = useState<SettingData>({
		value: userAuthenticate.email,
		error: false,
		errorMessage: ''
	})

	function handleInputEmailChange(event: ChangeEvent<HTMLInputElement>) {
		const value = event.target.value
		if (value.length === 0) {
			setEmail({
				value: value,
				error: true,
				errorMessage: "Email cannot be empty"
			})
		}
		else if (value.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
			setEmail({
				value: value,
				error: true,
				errorMessage: "Invalid email"
			})
		}
		else if (value.endsWith("@student.42.fr")) {
			setEmail({
				value: value,
				error: true,
				errorMessage: "42 emails are forbidden"
			})
		}
		else {
			setEmail({
				value: value,
				error: false
			})
		}
	}

	/* ============================ PHONE NUMBER ================================ */

	const [phoneNumber, setPhoneNumber] = useState<SettingData>({
		value: userAuthenticate.phoneNumber,
		error: false,
		errorMessage: ''
	})

	function handleInputPhoneNumberChange(event: ChangeEvent<HTMLInputElement>) {
		const value = event.target.value
		if (value.length === 0) {
			setPhoneNumber({
				value: value,
				error: true,
				errorMessage: "Phone number cannot be empty"
			})
		}
		else if (!/^(?:\+(?:[0-9] ?){6,14}[0-9]|[0-9]{10})$/.test(value)) {
			setPhoneNumber({
				value: value,
				error: true,
				errorMessage: "Invalid phone number"
			})
		}
		else {
			setPhoneNumber({
				value: value,
				error: false
			})
		}
	}

	/* ================================= 2FA ==================================== */

	const [twoFA, setTwoFA] = useState<boolean>(userAuthenticate.twoFA)

	const [QRcode, setQRcode] = useState<string>('')
	const [QRcodeValue, setQRcodeValue] = useState<string>('')

	function handleInputQRcodeChange(event: ChangeEvent<HTMLInputElement>) {
		const value = event.target.value
		setQRcodeValue(value)
	}

	async function handleClickTwoFAChange() {
		try {
			const responseQRcode = await axios.get(`http://${url}:3333/auth/2fa/generate`, {
				headers: {
					'Authorization': `Bearer ${token}`
				}
			})

			displayTwoFAMenu(true)
			setTwoFACodeQR(responseQRcode.data)
		}
		catch (error) {
			console.log(error)
		}
	}

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
			<ScrollBar visible>
				<CloseButtonWrapper>
					<Icon src={CloseIcon} size={24}
						onClick={() => displaySettingsMenu(false)}
						alt="Close button" title="Close" />
				</CloseButtonWrapper>
				<SettingsForm
					onSubmit={handleSubmit}
					autoComplete="off"
					spellCheck="false">
					<Setting>
						<SettingTtile>
							Username
						</SettingTtile>
						<InputText
							onChange={handleInputUsernameChange}
							onBlur={handleInputUsernameBlur}
							type="text" value={username.value as string}
							fontSize={16}
							$error={username.error} />
						<ErrorMessage>
							{username.error && username.errorMessage}
						</ErrorMessage>
					</Setting>
					<Setting>
						<SettingTtile>
							Password
						</SettingTtile>
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
												key={"error_message" + index}>
												{errorMessage}
											</ErrorMessage>)
										}
									)
								}
								</>
								:
								<ErrorMessage>
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
					</Setting>
					<Setting>
						<SettingTtile>
							E-mail
						</SettingTtile>
						<InputText
							onChange={handleInputEmailChange}
							type="text" value={email.value as string}
							fontSize={16}
							$error={email.error} />
						<ErrorMessage>
							{email.error && email.errorMessage}
						</ErrorMessage>
					</Setting>
					<Setting>
						<SettingTtile>
							Phone number
						</SettingTtile>
						<InputText
							onChange={handleInputPhoneNumberChange}
							type="text" value={phoneNumber.value as string}
							fontSize={16}
							$error={phoneNumber.error} />
						<ErrorMessage>
							{phoneNumber.error && phoneNumber.errorMessage}
						</ErrorMessage>
					</Setting>
					<Setting>
						<SettingTtile>
							2FA
						</SettingTtile>
						<TwoFAValue>
							{
								twoFA ?
									"Able"
									:
									"Disable"
							}
						</TwoFAValue>
						<div style={{ height: "15px" }} />
						<Button
							onClick={handleClickTwoFAChange}
							type="button" width={200}
							alt="Set 2FA button"
							title={twoFA ? "Disable" : "Able"}
							style={{ alignSelf: "center" }}>
							{
								twoFA ?
									"Disable"
									:
									"Able"
							}
						</Button>
					</Setting>

							{/* <img src={QRcode} />
							<InputText
								onSubmit={handleSubmitTWOfa}
								onChange={handleInputQRcodeChange}
								type="text" value={QRcodeValue}
								fontSize={16} /> */}

					<SelectAvatar
						avatar={avatar}
						setAvatar={setAvatar} />
					<Button
						type="submit"
						fontSize={19}
						alt="Save button" title="Save changes">
						Save
					</Button>
				</SettingsForm>
			</ScrollBar>
		</Style>
	)
}

export default SettingsMenu