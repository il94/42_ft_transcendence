import { ChangeEvent, FormEvent, useContext, useState } from 'react'

import {
	SigninPage,
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

import colors from '../../utils/colors'

import FTButton from "../../assets/42.png"
import axios from 'axios'
import AuthContext from '../../contexts/AuthContext'

function Signin() {

	console.log("YOP")

	type PropsSetting = {
		value: string,
		error: boolean,
		errorMessage?: string
	}

	const [login, setLogin] = useState<PropsSetting>({
		value: '',
		error: false,
		errorMessage: ''
	})
	const [password, setPassword] = useState<PropsSetting>({
		value: '',
		error: false,
		errorMessage: ''
	})

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		try {
			event.preventDefault()
			if (login.value.length === 0 ||
				password.value.length === 0)
			{
				if (login.value.length === 0)
				{
					setLogin({
						value: '',
						error: true,
						errorMessage: "Insert username or email",
					})
				}
				if (password.value.length === 0) 
				{
					setPassword({
						value: '',
						error: true,
						errorMessage: "Insert password",
					})
				}
				return
			}
			if (login.error || password.error)
				return

			const user = {
				login: login.value,
				hash: password.value
			}

			const response = await axios.post("http://localhost:3333/auth/signin", user)

			const { setToken } = useContext(AuthContext)!

			console.log(response.data)
			setToken(response.data)
		}
		catch (error) {

		}
	}

	/* ============================== LOGIN ================================== */

	function handleInputLoginChange(event: ChangeEvent<HTMLInputElement>) {
		const value = event.target.value
		setLogin({
			value: value,
			error: false
		})
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

	return (
		<SigninPage>
			<MainTitle>
				<StyledLink to="/">
					Transcendance
				</StyledLink>
			</MainTitle>
			<CentralWindow>
				<StyledTitle>
					Sign in
				</StyledTitle>
				<SettingsForm
					onSubmit={handleSubmit}
					autoComplete="off"
					spellCheck="false">
					<Setting>
						Login or email
						<InputText
							onChange={handleInputLoginChange}
							type="text" value={login.value}
							width={231}
							fontSize={25}
							$error={login.error} />
						<ErrorMessage>
							{login.error && login.errorMessage}
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
					<div style={{ marginTop: "10px" }} />
					<Button
						type="submit" fontSize={35}
						alt="Continue button" title="Continue">
						Continue
					</Button>
				</SettingsForm>
				<div>
					Don't have an account?&nbsp;
					<StyledLink to="/signup" color={colors.button}>
						Sign up
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
			</CentralWindow>
		</SigninPage>
	)
}

export default Signin