import {
	ChangeEvent,
	FormEvent,
	useContext,
	useEffect,
	useState
} from 'react'
import { useNavigate } from 'react-router'
import axios, { AxiosError } from 'axios'

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
import ErrorRequest from '../../componentsLibrary/ErrorRequest'

import AuthContext from '../../contexts/AuthContext'

import { SettingData } from '../../utils/types'
import { emptySetting } from '../../utils/emptyObjects'

import colors from '../../utils/colors'

import FTButton from "../../assets/42.png"
import ButtonImage from '../../componentsLibrary/ButtonImage'

function Signin() {
	const [errorRequest, setErrorRequest] = useState<boolean>(false)
	const { token, setToken } = useContext(AuthContext)!
	const navigate = useNavigate()

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
				username: login.value,
				hash: password.value
			}

			const response = await axios.post("http://localhost:3333/auth/signin", user)
	
			console.log("response =", response)

			//temporaire
			if (response.data.twoFA)
				navigate("/twofa")
			else
			{
				setToken(response.data.access_token)
				localStorage.setItem('token', response.data.access_token)
				
				navigate("/")
			}
		}
		catch (error) {
			const axiosError = error as AxiosError

			// if (axiosError.response?.status === 404)

			// temporaire
			if ((axiosError.response?.data as any)?.message === "user not found")
			{
				setLogin((prevState) => ({
					...prevState,
					error: true,
					errorMessage: "User not found",
				}))
			}

			// else if (axiosError.response?.status === 401)
			
			// temporaire
			else if ((axiosError.response?.data as any)?.message === "incorrect password")
			{
				setPassword((prevState) => ({
					...prevState,
					error: true,
					errorMessage: "Incorrect password",
				}))
			}
			else
			{
				setErrorRequest(true)
				localStorage.removeItem('token')
			}
		}
	}

	// async function connectionBy42() {
	// 	try {

	// 		const test = await axios.get("http://localhost:3333/auth/api42")
			
	// 		console.log(test)
			
	// 		setToken(test.data.access_token)
	// 		localStorage.setItem('token', test.data.access_token)
			
	// 		navigate("/game")
	// 	}
	// 	catch (error) {
	// 		console.log(error)
	// 	}
	// }

/* ================================ LOGIN =================================== */

	const [login, setLogin] = useState<SettingData>(emptySetting)

	function handleInputLoginChange(event: ChangeEvent<HTMLInputElement>) {
		const value = event.target.value
		setLogin({
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

/* ========================================================================== */

	return (
		<SigninPage>
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
						<LinkButtonImage to="http://localhost:3333/auth/api42">
							<img src={FTButton} style={{ paddingRight: "7px" }} />
							Continue with 42
						</LinkButtonImage>
					</FTRedirectWrapper>
				</>
				:
				<ErrorRequest />
			}
			</CentralWindow>
		</SigninPage>
	)
}

export default Signin