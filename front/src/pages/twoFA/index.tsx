import {
	ChangeEvent,
	FormEvent,
	useContext,
	useEffect,
	useRef,
	useState
} from 'react'
import {
	useNavigate,
	useLocation
} from 'react-router'
import axios, { AxiosError, AxiosResponse } from 'axios'
import Cookies from "js-cookie"
import StyledLink from '../../componentsLibrary/StyledLink/Index'
import Button from '../../componentsLibrary/Button'
import InputText from '../../componentsLibrary/InputText'
import Page from '../../componentsLibrary/Page'
import MainTitle from '../../componentsLibrary/MainTitle'
import WindowTitle from '../../componentsLibrary/WindowTitle'
import CentralWindow from '../../componentsLibrary/CentralWindow'
import {
	VerticalSettingsForm,
	VerticalSetting,
	ErrorMessage,
	VerticalSettingWrapper
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

	const { token, setToken, url } = useContext(AuthContext)!
	const navigate = useNavigate()
	const location = useLocation()

	const userId: string | number = Cookies.get('userId') ? Cookies.get('userId') : location.state.userId

	useEffect(() => {
		if (token || !userId)
			navigate("/error")
	}, [])

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		try {
			event.preventDefault()
			if (!code.value) {
				setCode({
					value: '',
					error: true,
					errorMessage: "Insert code",
				})
				return
			}
			else if (code.value.length < 6) {
				setCode((prevState: SettingData) => ({
					...prevState,
					error: true,
					errorMessage: "Code must contains 6 digits"
				}))
				return
			}

			if (code.error)
				return
			
			const authTwoFAResponse: AxiosResponse<PropsTwoFAResponse> = await axios.post(`http://${url}:3333/auth/2fa/authenticate/${userId}`, {
				twoFACode: code.value
			})
			 
			localStorage.setItem("access_token", authTwoFAResponse.data.access_token)
			setToken(authTwoFAResponse.data.access_token)

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
					navigate("/error")
			}
			else
				navigate("/error")
		}
	}

	/* ================================ CODE ==================================== */

	const [code, setCode] = useState<SettingData>(emptySetting)

	function handleInputCode(event: ChangeEvent<HTMLInputElement>) {
		const value = event.target.value
		if (value.length === 0) {
			setCode({
				value: value,
				error: true,
				errorMessage: "Code cannot be empty"
			})
		}
		else if (value.length > 6) {
			setCode((prevState: SettingData) => ({
				...prevState,
				error: true,
				errorMessage: "Code must contains 6 digits"
			}))
		}
		else if (!/\d/.test(value)) {
			setCode((prevState: SettingData) => ({
				...prevState,
				error: true,
				errorMessage: "Code must be containing by digits",
			}))
		}
		else {
			setCode({
				value: value,
				error: false
			})
		}
	}

	function handleInputCodeBlur() {
		setCode((prevState: SettingData) => ({
			...prevState,
			error: false
		}))
	}

	const inputCodeRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		const InputCodeContainer = inputCodeRef.current
		if (InputCodeContainer)
			InputCodeContainer.focus()
	})

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
				<VerticalSettingsForm
					onSubmit={handleSubmit}
					autoComplete="off"
					spellCheck="false">
					<VerticalSetting fontSize={18}>
						Enter the six-digit code from Google Authenticator to secure your authentication
						<VerticalSettingWrapper>
							<InputText
								onChange={handleInputCode}
								onBlur={handleInputCodeBlur}
								type="text" value={code.value}
								width={231}
								fontSize={25}
								$error={code.error}
								ref={inputCodeRef} />
							<ErrorMessage>
								{code.error && code.errorMessage}
							</ErrorMessage>
						</VerticalSettingWrapper>
					</VerticalSetting>
					<div style={{ height: "10px" }} />
					<Button
						type="submit" fontSize={35}
						alt="Continue button" title="Continue">
						Continue
					</Button>
				</VerticalSettingsForm>
			</CentralWindow>
		</Page>
	)
}

export default TwoFA