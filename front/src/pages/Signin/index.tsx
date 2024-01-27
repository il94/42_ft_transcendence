import {
	ChangeEvent,
	FormEvent,
	useContext,
	useEffect,
	useState
} from 'react'
import { useNavigate } from 'react-router'
import axios, { AxiosError, AxiosResponse } from 'axios'
import styled from 'styled-components'

import StyledLink from '../../componentsLibrary/StyledLink/Index'
import Button from '../../componentsLibrary/Button'
import LinkButtonImage from '../../componentsLibrary/LinkButtonImage'
import InputText from '../../componentsLibrary/InputText'
import Page from '../../componentsLibrary/Page'
import MainTitle from '../../componentsLibrary/MainTitle'
import CentralWindow from '../../componentsLibrary/CentralWindow'
import WindowTitle from '../../componentsLibrary/WindowTitle'
import Separator from '../../componentsLibrary/Separator/Index'
import ErrorMessage from '../../componentsLibrary/ErrorMessage/Index'
import SettingsForm from '../../componentsLibrary/SettingsForm/Index'
import Setting from '../../componentsLibrary/Setting/Index'

import AuthContext from '../../contexts/AuthContext'

import { ErrorResponse, SettingData } from '../../utils/types'
import { emptySetting } from '../../utils/emptyObjects'

import colors from '../../utils/colors'

import FTButton from "../../assets/42.png"

const FTRedirectWrapper = styled.div`

	display: flex;
	align-items: center;

	padding-bottom: 15px;

	text-align: center;

`

type PropsSigninResponse = {
	access_token: string
} | {
	twoFA: boolean
}

function Signin() {
	const { token, url } = useContext(AuthContext)!
	const navigate = useNavigate()

	useEffect(() => {
		if (token)
			navigate("/error")
	}, [])

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		try {
			event.preventDefault()
			if (email.value.length === 0 ||
				password.value.length === 0) {
				if (email.value.length === 0) {
					setEmail({
						value: '',
						error: true,
						errorMessage: "Insert email",
					})
				}
				if (password.value.length === 0) {
					setPassword({
						value: '',
						error: true,
						errorMessage: "Insert password",
					})
				}
				return
			}
			if (email.error || password.error)
				return

			const user = {
				email: email.value,
				hash: password.value
			}

			const signinResponse: AxiosResponse<PropsSigninResponse> = await axios.post(`http://${url}:3333/auth/signin`, user)

			if ('twoFA' in signinResponse.data)
				navigate("/twofa")
			else
			{
				localStorage.setItem('access_token', signinResponse.data.access_token)
				navigate("/")
			}
		}
		catch (error) {
			if (axios.isAxiosError(error)) {
				const axiosError = error as AxiosError<ErrorResponse>
				const { statusCode } = axiosError.response?.data!
				if (statusCode === 403 || statusCode === 404) {
					setEmail((prevState: SettingData) => ({
						...prevState,
						error: true,
						errorMessage: "Invalid email"
					}))
				}
				else
					navigate("/error");
			}
			else
				navigate("/error");
		}
	}

	/* ================================ EMAIL =================================== */

	const [email, setEmail] = useState<SettingData>(emptySetting)

	function handleInputEmailChange(event: ChangeEvent<HTMLInputElement>) {
		const value = event.target.value

		if (value.endsWith("@student.42.fr")) {
			setEmail({
				value: value,
				error: true,
				errorMessage: "Cannot signin with 42 email"
			})
		}
		else {	
			setEmail({
				value: value,
				error: false
			})
		}
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
		<Page>
			<MainTitle>
				<StyledLink to="/">
					Transcendance
				</StyledLink>
			</MainTitle>
			<CentralWindow>
				<WindowTitle>
					Sign in
				</WindowTitle>
				<SettingsForm
					onSubmit={handleSubmit}
					autoComplete="off"
					spellCheck="false">
					<Setting>
						Email
						<InputText
							onChange={handleInputEmailChange}
							type="text" value={email.value}
							width={231}
							fontSize={25}
							$error={email.error} />
						<ErrorMessage>
							{email.error && email.errorMessage}
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
				<Separator />
				<FTRedirectWrapper>
					<LinkButtonImage to={`http://${url}:3333/auth/api42`}>
						<img src={FTButton} style={{ paddingRight: "7px" }} />
						Continue with 42
					</LinkButtonImage>
				</FTRedirectWrapper>
			</CentralWindow>
		</Page>
	)
}

export default Signin