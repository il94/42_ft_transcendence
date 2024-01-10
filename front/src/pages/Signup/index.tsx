import { ChangeEvent, FormEvent, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router'

import {
	SignupPage,
	MainTitle,
	CentralWindow,
	StyledTitle,
	SettingsForm,
	Setting,
	FTRedirectWrapper,
	Separator,
	Line,
	TextSeparator,
	ErrorMessage
} from './style'

import StyledLink from '../../componentsLibrary/StyledLink/Index'
import Button from '../../componentsLibrary/Button'
import LinkButtonImage from '../../componentsLibrary/LinkButtonImage'
import InputText from '../../componentsLibrary/InputText'
import ErrorRequest from '../../componentsLibrary/ErrorRequest'

import AuthContext from '../../contexts/AuthContext'

import { getRandomDefaultAvatar } from '../../utils/functions'

import { SettingData } from '../../utils/types'
import { emptySetting } from '../../utils/emptyObjects'

import colors from '../../utils/colors'

import FTButton from "../../assets/42.png"

function Signup() {

	const { token, setToken } = useContext(AuthContext)!
	const [errorRequest, setErrorRequest] = useState<boolean>(false)
	const navigate = useNavigate()

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

			const response = await axios.post("http://localhost:3333/auth/signup", newUser)

			setToken(response.data.access_token)
			localStorage.setItem('token', response.data.access_token)

			navigate("/")
		}
		catch (error) {
			// temporaire
			// Gestion d'erreurs utilisateur a faire

			console.log(error)
			setErrorRequest(true)
			localStorage.removeItem('token')
		}
	}

/* ============================== USERNAME ================================== */

	const [username, setUsername] = useState<SettingData>(emptySetting)

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
			setUsername({
				value: value,
				error: false
			})
		}
	}

	function handleInputUsernameBlur(event: ChangeEvent<HTMLInputElement>) {
		const value = event.target.value
		setUsername({
			value: value,
			error: false
		})
	}

/* ============================== PASSWORD ================================== */

	const [password, setPassword] = useState<SettingData>(emptySetting)

	function handleInputPasswordChange(event: ChangeEvent<HTMLInputElement>) {
		const value = event.target.value
		setPassword({
			value: value,
			error: false
		})
	}

	const [showPassword, setShowPassword] = useState<boolean>(false)

/* =============================== EMAIL ==================================== */

	const [email, setEmail] = useState<SettingData>(emptySetting)

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

	const [phoneNumber, setPhoneNumber] = useState<SettingData>(emptySetting)

	function handleInputPhoneNumberChange(event: ChangeEvent<HTMLInputElement>) {
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
	
/* ========================================================================== */

	useEffect(() => {
		if (token)
			setErrorRequest(true)
	}, [])

	return (
		<SignupPage>
			<MainTitle>
				<StyledLink to="/">
					Transcendance
				</StyledLink>
			</MainTitle>
			<CentralWindow>
			{
				!errorRequest ?
				<>
					<StyledTitle>
						Sign up
					</StyledTitle>
					<SettingsForm
						onSubmit={handleSubmit}
						autoComplete="off"
						spellCheck="false">
						<Setting>
							Username
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
						</Setting>
						<Setting>
							Password
							<InputText
								onChange={handleInputPasswordChange}
								type={showPassword ? "text" : "password"}
								value={password.value as string}
								width={231}
								fontSize={25}
								$error={password.error} />
							<ErrorMessage>
								{password.error && password.errorMessage}
							</ErrorMessage>
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
						</Setting>
						<Setting>
							E-mail
							<InputText
								onChange={handleInputEmailChange}
								type="text" value={email.value as string}
								width={231}
								fontSize={25}
								$error={email.error} />
							<ErrorMessage>
								{email.error && email.errorMessage}
							</ErrorMessage>
						</Setting>
						<Setting>
							Phone number
							<InputText
								onChange={handleInputPhoneNumberChange}
								type="text" value={phoneNumber.value as string}
								width={231}
								fontSize={25}
								$error={phoneNumber.error} />
							<ErrorMessage>
								{phoneNumber.error && phoneNumber.errorMessage}
							</ErrorMessage>
						</Setting>
						<div style={{ marginTop: "10px" }} />
						<Button
							type="submit" fontSize={35}
							alt="Continue button" title="Continue">
							Continue
						</Button>
					</SettingsForm>
					<div>
						Already have an account ?&nbsp;
						<StyledLink to="/signin" color={colors.button}>
							Sign in
						</StyledLink>
					</div>
					<Separator>
						<Line />
						<TextSeparator>
							OR
						</TextSeparator>
						<Line />
					</Separator>
					<FTRedirectWrapper>
						<LinkButtonImage to="http://localhost:3333/auth/api42/login">
							<img src={FTButton} style={{ paddingRight: "7px" }} />
							Continue with 42
						</LinkButtonImage>
					</FTRedirectWrapper>
				</>
				:
				<ErrorRequest />
			}
			</CentralWindow>
		</SignupPage>
	)
}

export default Signup
