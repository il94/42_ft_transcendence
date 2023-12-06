import { ChangeEvent, Dispatch, SetStateAction, useState } from "react"

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

	type PropsError = {
		message: string,
		state: boolean,
		category?: string
	}

	const [error, setError] = useState<PropsError>({ message: '', state: false })

	const [username, setUsername] = useState<string>(userData.username)
	function handleInputUsernameChange(event: ChangeEvent<HTMLInputElement>) {
		const value = event.target.value
		if (value.length > 8 )
		{
			setError({
				message: "8 characters max",
				state: true,
				category: "username"
			})
		}
		else if (!/^[a-zA-Z0-9-_.]*$/.test(value))
		{
			setError({
				message: "Username can't contain special characters",
				state: true,
				category: "username"
			})
		}
		else
		{
			setUsername(value)
			setError({
				message: '',
				state: false
			})
		}
	}

	const [email, setEmail] = useState<string>(userData.email)
	function handleInputEmailChange(event: ChangeEvent<HTMLInputElement>) {
		const value = event.target.value
		if (!/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(value))
		{
			setError({
				message: "Invalid email",
				state: true,
				category: "email"
			})
		}
		else
		{
			setError({
				message: '',
				state: false
			})
		}
		setEmail(value)
	}


	const [hash, setHash] = useState<string>(userData.hash)
	const [showPassword, setShowPassword] = useState<boolean>(false)
	function handleInputPasswordChange(event: ChangeEvent<HTMLInputElement>) {
		setHash(event.target.value)
	}

	const [tel, setTel] = useState<string>(userData.tel)
	function handleInputTelChange(event: ChangeEvent<HTMLInputElement>) {
		const value = event.target.value
		if (!/^(\+33|0)[1-9](\s?\d{2}){4}$/.test(value))
		{
			setError({
				message: "Invalid phone number",
				state: true,
				category: "tel"
			})
		}
		else
		{
			setError({
				message: '',
				state: false
			})
		}
		setTel(value)
	}

	const [twoFA, setTwoFA] = useState<boolean>(userData.twoFA)
	function handleClickTwoFAChange() {

		if (userData.email === '' && userData.tel === '')
		{
			setError({
				message: "No valid email or phone number",
				state: true,
				category: "twoFA"
			})
		}
		else
			setTwoFA(!twoFA)
	}

	const [avatar, setAvatar] = useState<string>(userData.avatar)

	return (
		<PseudoStyle>
			<Style>
				<CloseButtonWrapper>
					<Icon src={CloseIcon} size={24}
						onClick={() => displaySettingsMenu(false)}
						alt="Close button" title="Close" />
				</CloseButtonWrapper>
				<SettingsForm
					autoComplete="off"
					spellCheck="false">
					<Setting>
						<SettingTtile>
							Username
						</SettingTtile>
						<InputText
							onChange={handleInputUsernameChange}
							onBlur={() => setError({ message: '', state: false})}
							type="text" value={username}
							$fontSize={16}
							$error={error.category === "username" && error.state} />
						<ErrorMessage>
							{error.category === "username" && error.message}
						</ErrorMessage>
					</Setting>
					<Setting>
						<SettingTtile>
							E-mail
						</SettingTtile>
						<InputText
							onChange={handleInputEmailChange}
							type="text" value={email}
							$fontSize={16}
							$error={error.category === "email" && error.state} />
						<ErrorMessage>
							{error.category === "email" && error.message}
						</ErrorMessage>
					</Setting>
					<Setting>
						<SettingTtile>
							Password
						</SettingTtile>
						<InputText
							onChange={handleInputPasswordChange}
							type={showPassword ? "text" : "password"} value={hash}
							$fontSize={16}
							$error={error.category === "password" && error.state} />
						<Button
							onClick={() => setShowPassword(!showPassword)}
							type="button" width={200}
							alt="Show password button"
							title={showPassword ? "Hide password" : "Show password"}
							style={{ alignSelf: "center", marginTop: "12.5px", marginBottom: "7.5px" }}>
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
							Phone number
						</SettingTtile>
						<InputText
							onChange={handleInputTelChange}
							type="text" value={tel}
							$fontSize={16}
							$error={error.category === "tel" && error.state} />
						<ErrorMessage>
							{error.category === "tel" && error.message}
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
						<Button
							onClick={handleClickTwoFAChange}
							type="button" width={200}
							alt="Set 2FA button"
							title={showPassword ? "Disable" : "Able"}
							style={{ alignSelf: "center", marginTop: "12.5px" }}>
						{
							twoFA ?
								"Disable"
							:
								"Able"
						}
						</Button>
						<ErrorMessage>
							{error.category === "twoFA" && error.message}
						</ErrorMessage>
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