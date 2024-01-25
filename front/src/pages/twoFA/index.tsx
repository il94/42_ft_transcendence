import {
	ChangeEvent,
	FormEvent,
	useContext,
	useEffect,
	useState
} from 'react'
import { useNavigate } from 'react-router'
import axios, { AxiosError } from 'axios'

import StyledLink from '../../componentsLibrary/StyledLink/Index'
import Button from '../../componentsLibrary/Button'
import InputText from '../../componentsLibrary/InputText'
import Page from '../../componentsLibrary/Page'
import MainTitle from '../../componentsLibrary/MainTitle'
import WindowTitle from '../../componentsLibrary/WindowTitle'
import ErrorMessage from '../../componentsLibrary/ErrorMessage/Index'
import CentralWindow from '../../componentsLibrary/CentralWindow'
import SettingsForm from '../../componentsLibrary/SettingsForm/Index'
import Setting from '../../componentsLibrary/Setting/Index'

import AuthContext from '../../contexts/AuthContext'

import { ErrorResponse, SettingData } from '../../utils/types'
import { emptySetting } from '../../utils/emptyObjects'

function TwoFA() {
	const { token, setToken } = useContext(AuthContext)!
	const navigate = useNavigate()

	useEffect(() => {
		if (token)
			navigate("/error")
	}, [])

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		try {
			event.preventDefault()
			if (code.value.length === 0) {
				setCode({
					value: '',
					error: true,
					errorMessage: "Insert code",
				})
				return
			}

			/* ============ Temporaire ============== */

			// const response = await axios.post(`http://${url}:3333/auth/signin/twofa`, code)

			// setToken(response.data.access_token)
			// localStorage.setItem("access_token", response.data.access_token)

			/* ====================================== */

			navigate("/game")
		}
		catch (error) {
			if (axios.isAxiosError(error)) {
				const axiosError = error as AxiosError<ErrorResponse>
				const { statusCode } = axiosError.response?.data!
				if (statusCode === 403) {
					setCode((prevState: SettingData) => ({
						...prevState,
						error: true,
						errorMessage: "Wrong code"
					}))
				}
				else
					navigate("/error");
			}
			else
				navigate("/error");
		}
	}

	/* ================================ CODE =================================== */

	const [code, setCode] = useState<SettingData>(emptySetting)

	function handleInputCodeChange(event: ChangeEvent<HTMLInputElement>) {
		const value = event.target.value
		setCode({
			value: value,
			error: false
		})
	}

	/* ========================================================================== */

	useEffect(() => {
		async function sendCode() {
			try {

				/* ============ Temporaire ============== */

				// const response = await axios.post(`http://${url}:3333/auth/signin/twofa`)

				/* ====================================== */
			}
			catch (error) {
				navigate("/error");
			}
		}
		sendCode()
	}, [])

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
					TwoFA
				</WindowTitle>
				<SettingsForm
					onSubmit={handleSubmit}
					autoComplete="off"
					spellCheck="false">
					<Setting>
						Enter the six-digit code from Google Authenticator to secure your authentication
						<InputText
							onChange={handleInputCodeChange}
							type="text" value={code.value}
							width={231}
							fontSize={25}
							$error={code.error} />
						<ErrorMessage>
							{code.error && code.errorMessage}
						</ErrorMessage>
					</Setting>
					<div style={{ height: "10px" }} />
					<Button
						type="submit" fontSize={35}
						alt="Continue button" title="Continue">
						Continue
					</Button>
				</SettingsForm>
			</CentralWindow>
		</Page>
	)
}

export default TwoFA