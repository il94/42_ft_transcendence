import {
	ChangeEvent,
	FormEvent,
	useContext,
	useEffect,
	useState
} from 'react'
import { useNavigate } from 'react-router'
import axios, { AxiosError, AxiosResponse } from 'axios'

import StyledLink from '../../componentsLibrary/StyledLink/Index'
import Button from '../../componentsLibrary/Button'
import InputText from '../../componentsLibrary/InputText'
import Page from '../../componentsLibrary/Page'
import MainTitle from '../../componentsLibrary/MainTitle'
import WindowTitle from '../../componentsLibrary/WindowTitle'
import CentralWindow from '../../componentsLibrary/CentralWindow'
import {
	HorizontalSettingsForm,
	HorizontalSetting,
	ErrorMessage
} from '../../componentsLibrary/SettingsForm/Index'

import AuthContext from '../../contexts/AuthContext'

import {
	ErrorResponse,
	SettingData
} from '../../utils/types'

import {
	emptySetting
} from '../../utils/emptyObjects'

type PropsTwoFAResponse = {
	access_token: string
}

function TwoFA() {
	const { token, url } = useContext(AuthContext)!
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

			const twoFAResponse: AxiosResponse<PropsTwoFAResponse> = await axios.post(`http://${url}:3333/auth/2fa/authenticate`, {
				twoFACode: code
			})
	
			localStorage.setItem("access_token", twoFAResponse.data.access_token)
			navigate("/")
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
				<HorizontalSettingsForm
					onSubmit={handleSubmit}
					autoComplete="off"
					spellCheck="false">
					<HorizontalSetting>
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
					</HorizontalSetting>
					<div style={{ height: "10px" }} />
					<Button
						type="submit" fontSize={35}
						alt="Continue button" title="Continue">
						Continue
					</Button>
				</HorizontalSettingsForm>
			</CentralWindow>
		</Page>
	)
}

export default TwoFA