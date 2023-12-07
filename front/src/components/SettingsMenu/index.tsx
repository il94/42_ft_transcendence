import {
	ChangeEvent,
	Dispatch,
	FormEvent,
	SetStateAction,
	useEffect,
	useState
} from "react"

import {
	PseudoStyle,
	Setting,
	SettingTtile,
	Style,
	CloseButtonWrapper,
	SettingsForm,
	ErrorMessage,
	TwoFAValue
} from "./style"

import Icon from "../../componentsLibrary/Icon"

import CloseIcon from "../../assets/close.png"
import Button from "../../componentsLibrary/Button"
import InputText from "../../componentsLibrary/InputText"
import SelectAvatar from "./SelectAvatar"
// import axios from "axios"

type PropsSettingsMenu = {
	userData: {
		username: string,
		hash: string,
		avatar: string,
		email: string,
		tel: string,
		twoFA: boolean
	}
	displaySettingsMenu: Dispatch<SetStateAction<boolean>>,
}

function SettingsMenu({ displaySettingsMenu, userData }: PropsSettingsMenu) {

	function handleSubmit(event: FormEvent<HTMLFormElement>) {

		event.preventDefault()

		if (username.error || password.error || email.error || phoneNumber.error)
			return
		else
		{
			// 	/* ============ Temporaire ============== */
			
			// Modifier le User avec un truc du style
			// axios.patch("http://localhost:3333/user/me", {
				// 	username: username,
				// 	hash: hash,
				// 	email: email,
				// 	tel: tel,
				// 	twoFA: twoFA,
				// 	avatar: avatar
				// })
				// .then((response) => console.log(response))
				// .catch((error) => console.log(error))
			}
	}

	type PropsSetting = {
		value: string | boolean,
		error: boolean,
		errorMessage?: string
	}


/* ============================== USERNAME ================================== */

	const [username, setUsername] = useState<PropsSetting>({
		value: userData.username,
		error: false,
		errorMessage: ''
	})
	function handleInputUsernameChange(event: ChangeEvent<HTMLInputElement>) {
		const value = event.target.value
		if (value.length > 8 )
		{
			setUsername((prevState) => ({
				...prevState,
				error: true,
				errorMessage: "8 characters max"
			}))
		}
		else if (!/^[a-zA-Z0-9-_.]*$/.test(value))
		{
			setUsername((prevState) => ({
				...prevState,
				error: true,
				errorMessage: "Username can't contain special characters",
			}))
		}
		else
		{
			if (value.length === 0)
			{
				setUsername({
					value: value,
					error: true,
					errorMessage: "Insert username",
				})
			}
			else
			{
				setUsername({
					value: value,
					error: false
				})
			}
		}
	}

	function handleInputUsernameBlur(event: ChangeEvent<HTMLInputElement>) {
		const value = event.target.value
		if (value.length === 0)
		{
			setUsername({
				value: value,
				error: true,
				errorMessage: "Insert username",
			})
		}
		else
		{
			setUsername({
				value: value,
				error: false
			})
		}
	}

/* ============================== PASSWORD ================================== */

	const [password, setPassword] = useState<PropsSetting>({
		value: '',
		error: false,
		errorMessage: ''
	})

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

	const [email, setEmail] = useState<PropsSetting>({
		value: userData.email,
		error: false,
		errorMessage: ''
	})
	function handleInputEmailChange(event: ChangeEvent<HTMLInputElement>) {
		const value = event.target.value
		if (!/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(value))
		{
			setEmail({
				value: value,
				error: true,
				errorMessage: "Invalid email"
			})
		}
		else
		{
			setEmail({
				value: value,
				error: false
			})
		}
	}

/* ============================ PHONE NUMBER ================================ */

	const [phoneNumber, setPhoneNumber] = useState<PropsSetting>({
		value: userData.tel,
		error: false,
		errorMessage: ''
	})
	function handleInputTelChange(event: ChangeEvent<HTMLInputElement>) {
		const value = event.target.value
		if (!/^(\+33|0)[1-9](\s?\d{2}){4}$/.test(value) && value.length !== 0)
		{
			setPhoneNumber({
				value: value,
				error: true,
				errorMessage: "Invalid phone number"
			})
		}
		else
		{
			setPhoneNumber({
				value: value,
				error: false
			})
		}
	}

/* ================================= 2FA ==================================== */

	const [twoFA, setTwoFA] = useState<PropsSetting>({
		value: userData.twoFA,
		error: false,
		errorMessage: ''
	})
	function handleClickTwoFAChange() {
		if (email.error)
		{
			setTwoFA({
				value: false,
				error: true,
				errorMessage: "No valid email"
			})
		}
		else
		{
			setTwoFA({
				value: !twoFA.value,
				error: false
			})
		}
	}

	useEffect(() => {
		if (email.error)
		{
			setTwoFA({
				value: false,
				error: true,
				errorMessage: "No valid email"
			})
		}
		else
		{
			setTwoFA((prevState) => ({
				...prevState,
				error: false
			}))
		}
	}, [email.value, phoneNumber.value])

/* =============================== AVATAR =================================== */

	const [avatar, setAvatar] = useState<string>(userData.avatar)

/* ========================================================================== */

	return (
		<PseudoStyle>
			<Style>
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
							$fontSize={16}
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
							$fontSize={16}
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
							$fontSize={16}
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
							$fontSize={16}
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
					<SelectAvatar
						avatar={avatar}
						setAvatar={setAvatar}/>
					<Button
						type="submit"
						fontSize={19}
						alt="Save button" title="Save changes">
						Save
					</Button>
				</SettingsForm>
			</Style>
		</PseudoStyle>
	)
}

export default SettingsMenu