import {
	ChangeEvent,
	Dispatch,
	FormEvent,
	SetStateAction,
	useContext,
	useEffect,
	useState
} from "react"
import axios from "axios"

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

import { UserAuthenticate } from "../../utils/types"

import CloseIcon from "../../assets/close.png"

type PropsSettingsMenu = {
	token: string,
	url: string,
	userAuthenticate: UserAuthenticate,
	setUserAuthenticate: Dispatch<SetStateAction<UserAuthenticate>>,
	displaySettingsMenu: Dispatch<SetStateAction<boolean>>,
	displayTwoFAMenu: Dispatch<SetStateAction<boolean>>,
	setTwoFACodeQR: Dispatch<SetStateAction<string>>
}


function SettingsMenu({ token, url, userAuthenticate, setUserAuthenticate, displaySettingsMenu, displayTwoFAMenu, setTwoFACodeQR }: PropsSettingsMenu) {

	type PropsSetting = {
		value: string,
		error: boolean,
		errorMessage?: string
	}

	type PropsTwoFA = {
		value: boolean,
		error: boolean,
		errorMessage?: string
	}

	const [username, setUsername] = useState<PropsSetting>({
		value: userAuthenticate.username,
		error: false,
		errorMessage: ''
	})
	const [password, setPassword] = useState<PropsSetting>({
		value: '',
		error: false,
		errorMessage: ''
	})
	const [email, setEmail] = useState<PropsSetting>({
		value: userAuthenticate.email,
		error: false,
		errorMessage: ''
	})
	const [phoneNumber, setPhoneNumber] = useState<PropsSetting>({
		value: userAuthenticate.phoneNumber,
		error: false,
		errorMessage: ''
	})
	const [twoFA, setTwoFA] = useState<PropsTwoFA>({
		value: userAuthenticate.twoFA,
		error: false,
		errorMessage: ''
	})
	const [avatar, setAvatar] = useState<string>(userAuthenticate.avatar)



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

			console.log("SUBMIT")

			event.preventDefault()
			if (username.error ||
				password.error ||
				email.error ||
				phoneNumber.error)
				return

			// const test = await axios.get(`http://localhost:3333/auth/2fa/generate`, {
			// 	headers: {
			// 		'Authorization': `Bearer ${token}`
			// 	}
			// })

			// setTestt(test.data)

			// console.log("test", test)

			const newDatas: any = {
				username: username.value !== userAuthenticate.username ? username.value : undefined,
				avatar: avatar !== userAuthenticate.avatar ? avatar : undefined,
				hash: password.value ? password.value : undefined,
				email: email.value !== userAuthenticate.email ? email.value : undefined,
				phoneNumber: phoneNumber.value !== userAuthenticate.phoneNumber ? phoneNumber.value : undefined,
				twoFA: twoFA.value !== userAuthenticate.twoFA ? twoFA.value : undefined,
			}

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
			displaySettingsMenu(false)
		}
		catch (error) {

			// afficher correctement la gestion d'erreur

			console.log(error)
		}
	}

	/* ============================== USERNAME ================================== */

	function handleInputUsernameChange(event: ChangeEvent<HTMLInputElement>) {
		const value = event.target.value
		if (value.length > 8) {
			setUsername((prevState) => ({
				...prevState,
				error: true,
				errorMessage: "8 characters max"
			}))
		}
		else if (!/^[a-zA-Z0-9-_.]*$/.test(value)) {
			setUsername((prevState) => ({
				...prevState,
				error: true,
				errorMessage: "Username can't contain special characters",
			}))
		}
		else {
			if (value.length === 0) {
				setUsername({
					value: value,
					error: true,
					errorMessage: "Insert username",
				})
			}
			else {
				setUsername({
					value: value,
					error: false
				})
			}
		}
	}

	function handleInputUsernameBlur(event: ChangeEvent<HTMLInputElement>) {
		const value = event.target.value
		if (value.length === 0) {
			setUsername({
				value: value,
				error: true,
				errorMessage: "Insert username",
			})
		}
		else {
			setUsername({
				value: value,
				error: false
			})
		}
	}

	/* ============================== PASSWORD ================================== */

	function handleInputPasswordChange(event: ChangeEvent<HTMLInputElement>) {
		const value = event.target.value
		setPassword({
			value: value,
			error: false
		})
	}

	const [showPassword, setShowPassword] = useState<boolean>(false)
	const [placeHolder, setPlaceHolder] = useState<string>("New password")

	/* =============================== EMAIL ==================================== */

	function handleInputEmailChange(event: ChangeEvent<HTMLInputElement>) {
		const value = event.target.value
		if (!/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(value)) {
			setEmail({
				value: value,
				error: true,
				errorMessage: "Invalid email"
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

	function handleInputTelChange(event: ChangeEvent<HTMLInputElement>) {
		const value = event.target.value
		if (!/^(\+33|0)[1-9](\s?\d{2}){4}$/.test(value) && value.length !== 0) {
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

	// useEffect(() => {
	// 	if (email.error && phoneNumber.error) {
	// 		setTwoFA({
	// 			value: false,
	// 			error: true,
	// 			errorMessage: "No valid email or phone number"
	// 		})
	// 	}
	// 	else {
	// 		setTwoFA((prevState) => ({
	// 			...prevState,
	// 			error: false
	// 		}))
	// 	}
	// }, [email.value, phoneNumber.value])

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
						<ErrorMessage>
							{password.error && password.errorMessage}
						</ErrorMessage>
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
							onChange={handleInputTelChange}
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
						<TwoFAValue $error={twoFA.error}>
							{
								twoFA.value ?
									"Able"
									:
									"Disable"
							}
						</TwoFAValue>
						<ErrorMessage>
							{twoFA.error && twoFA.errorMessage}
						</ErrorMessage>
						<Button
							onClick={handleClickTwoFAChange}
							type="button" width={200}
							alt="Set 2FA button"
							title={twoFA.value ? "Disable" : "Able"}
							style={{ alignSelf: "center" }}>
							{
								twoFA.value ?
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