import {
	ChangeEvent,
	FormEvent,
	useContext,
	useEffect,
	useState
} from 'react'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { useNavigate } from 'react-router'

import StyledLink from '../../componentsLibrary/StyledLink/Index'
import Button from '../../componentsLibrary/Button'
import InputText from '../../componentsLibrary/InputText'
import Page from '../../componentsLibrary/Page'
import MainTitle from '../../componentsLibrary/MainTitle'
import CentralWindow from '../../componentsLibrary/CentralWindow'
import WindowTitle from '../../componentsLibrary/WindowTitle'
import {
	HorizontalSettingsForm,
	HorizontalSetting,
	ErrorMessage,
	VerticalSettingWrapper
} from '../../componentsLibrary/SettingsForm/Index'

import AuthContext from '../../contexts/AuthContext'

import {
	getRandomDefaultAvatar
} from '../../utils/functions'

import {
	ErrorResponse,
	SettingData
} from '../../utils/types'

import {
	emptySetting
} from '../../utils/emptyObjects'

import colors from '../../utils/colors'

type PropsSignupResponse = {
	access_token: string
}

function Signup() {

	const { token, url } = useContext(AuthContext)!
	const navigate = useNavigate()

	useEffect(() => {
		if (token)
			navigate("/error")
	}, [])

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		try {
			event.preventDefault()
			if (username.value.length === 0 ||
				password.value.length === 0 ||
				email.value.length === 0 ||
				phoneNumber.value.length === 0) {
				if (username.value.length === 0) {
					setUsername({
						value: '',
						error: true,
						errorMessage: "Insert username",
					})
				}
				if (password.value.length === 0) {
					setPassword({
						value: '',
						error: true,
						errorMessage: "Insert password",
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

			const newUser = {
				username: username.value,
				hash: password.value,
				email: email.value,
				phoneNumber: phoneNumber.value,
				avatar: getRandomDefaultAvatar()
			}

			const signupResponse: AxiosResponse<PropsSignupResponse> = await axios.post(`http://${url}:3333/auth/signup`, newUser)

			localStorage.setItem("access_token", signupResponse.data.access_token)

			navigate("/")
		}
		catch (error) {
			if (axios.isAxiosError(error)) {
				const axiosError = error as AxiosError<ErrorResponse>
				const { statusCode } = axiosError.response?.data!
				// TODO : GESTION d'erreur si nom ou mail deja pris
				if (statusCode === 403 || statusCode === 409) {
					setEmail((prevState) => ({
						...prevState,
						error: true,
						errorMessage: "Invalid email"
					}))
				}
				else
					navigate("/error")
			}
			else
				navigate("/error")
		}
	}

	/* ============================== USERNAME ================================== */

	const [username, setUsername] = useState<SettingData>(emptySetting)

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
			!/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(value)) {
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

	/* =============================== EMAIL ==================================== */

	const [email, setEmail] = useState<SettingData>(emptySetting)

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

	const [phoneNumber, setPhoneNumber] = useState<SettingData>(emptySetting)

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

	/* ========================================================================== */

	return (
		<Page>
			<MainTitle>
				<StyledLink to="/">
					Transcendance
				</StyledLink>
			</MainTitle>
			<CentralWindow>
				<WindowTitle>
					Sign up
				</WindowTitle>
				<HorizontalSettingsForm
					onSubmit={handleSubmit}
					autoComplete="off"
					spellCheck="false">
					<HorizontalSetting>
						Username
						<VerticalSettingWrapper>
							<InputText
								onChange={handleInputUsernameChange}
								onBlur={handleInputUsernameBlur}
								type="text" value={username.value}
								width={231}
								fontSize={25}
								$error={username.error} />
							<ErrorMessage>
								{username.error && username.errorMessage}
							</ErrorMessage>
						</VerticalSettingWrapper>
					</HorizontalSetting>
					<HorizontalSetting>
						Password
						<VerticalSettingWrapper>
							<InputText
								onChange={handleInputPasswordChange}
								type={showPassword ? "text" : "password"}
								value={password.value as string}
								width={231}
								fontSize={25}
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
								type="button"
								fontSize={18}
								alt="Show password button"
								title={showPassword ? "Hide password" : "Show password"}
								style={{ marginTop: "2.5px", marginBottom: "15px" }} >
								{
									showPassword ?
										"Hide password"
										:
										"Show password"
								}
							</Button>
						</VerticalSettingWrapper>
					</HorizontalSetting>
					<HorizontalSetting>
						E-mail
						<VerticalSettingWrapper>
							<InputText
								onChange={handleInputEmailChange}
								type="text" value={email.value as string}
								width={231}
								fontSize={25}
								$error={email.error} />
							<ErrorMessage>
								{email.error && email.errorMessage}
							</ErrorMessage>
						</VerticalSettingWrapper>
					</HorizontalSetting>
					<HorizontalSetting>
						Phone number
						<VerticalSettingWrapper>
							<InputText
								onChange={handleInputPhoneNumberChange}
								type="text" value={phoneNumber.value as string}
								width={231}
								fontSize={25}
								$error={phoneNumber.error} />
							<ErrorMessage>
								{phoneNumber.error && phoneNumber.errorMessage}
							</ErrorMessage>
						</VerticalSettingWrapper>
					</HorizontalSetting>
					<div style={{ height: "10px" }} />
					<Button
						type="submit" fontSize={35}
						alt="Continue button" title="Continue">
						Continue
					</Button>
				</HorizontalSettingsForm>
				<div>
					Already have an account ?&nbsp;
					<StyledLink to="/signin" color={colors.button}>
						Sign in
					</StyledLink>
				</div>
				<div style={{ height: "15px" }} />
			</CentralWindow>
		</Page>
	)
}

export default Signup
