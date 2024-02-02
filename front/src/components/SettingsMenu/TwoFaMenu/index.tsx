import {
	ChangeEvent,
	Dispatch,
	FormEvent,
	SetStateAction,
	useContext,
	useEffect,
	useRef,
	useState
} from "react"
import axios, { AxiosError, AxiosResponse } from "axios"

import {
	Message,
	QRCode,
	QRCodeWrapper,
	Style
} from "./style"

import InputText from "../../../componentsLibrary/InputText"
import CloseButton from "../../../componentsLibrary/CloseButton"
import Loader from "../../../componentsLibrary/Loader"
import {
	ErrorMessage,
	HorizontalSetting,
	HorizontalSettingsForm,
	VerticalSettingWrapper
} from "../../../componentsLibrary/SettingsForm/Index"

import AuthContext from "../../../contexts/AuthContext"
import InteractionContext from "../../../contexts/InteractionContext"
import DisplayContext from "../../../contexts/DisplayContext"

import {
	ErrorResponse,
	SettingData,
	UserAuthenticate
} from "../../../utils/types"

import {
	emptySetting
} from "../../../utils/emptyObjects"

type PropsTwoFaMenu = {
	displayTwoFAMenu: Dispatch<SetStateAction<boolean>>
}

function TwoFaMenu({ displayTwoFAMenu }: PropsTwoFaMenu) {

	const { token, url } = useContext(AuthContext)!
	const { userAuthenticate, setUserAuthenticate } = useContext(InteractionContext)!
	const { displayPopupError } = useContext(DisplayContext)!

	/* =============================== SUBMIT =================================== */

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		try {
			event.preventDefault()

			if (!userAuthenticate.twoFA) {
				await axios.patch(`http://${url}:3333/auth/2fa/enable`, {
					twoFACode: code
				},
					{
						headers: {
							'Authorization': `Bearer ${token}`
						}
					})

				setUserAuthenticate((prevState: UserAuthenticate) => ({
					...prevState,
					twoFA: true
				}))
			}
			else {
				await axios.patch(`http://${url}:3333/auth/2fa/disable`, {
					twoFACode: code
				},
					{
						headers: {
							'Authorization': `Bearer ${token}`
						}
					})

				setUserAuthenticate((prevState: UserAuthenticate) => ({
					...prevState,
					twoFA: false
				}))
			}
			displayTwoFAMenu(false)
		}
		catch (error) {
			if (axios.isAxiosError(error)) {
				const axiosError = error as AxiosError<ErrorResponse>
				const { statusCode, message } = axiosError.response?.data!
				if (statusCode === 400) //403
				{
					setCode((prevState: SettingData) => ({
						...prevState,
						error: true,
						errorMessage: "Wrong code"
					}))
				}
				else if (statusCode === 404 || statusCode === 409)
					displayPopupError({ display: true, message: message })
				else
					displayPopupError({ display: true })
			}
			else
				displayPopupError({ display: true })
		}
	}

	/* ============================== QR CODE =================================== */

	const [qrCode, setQRCode] = useState<string>('')
	const [loader, setloader] = useState<boolean>(true)

	useEffect(() => {
		async function fetchTwoFAQRCode() {
			try {
				const generateQRCodeResponse: AxiosResponse<string> = await axios.get(`http://${url}:3333/auth/2fa/generate`, {
					headers: {
						'Authorization': `Bearer ${token}`
					}
				})

				setQRCode(generateQRCodeResponse.data)
				setloader(false)
			}
			catch (error) {
				if (axios.isAxiosError(error)) {
					const axiosError = error as AxiosError<ErrorResponse>
					const { statusCode, message } = axiosError.response?.data!
					if (statusCode === 403 || statusCode === 404 || statusCode === 409)
						displayPopupError({ display: true, message: message })
					else
						displayPopupError({ display: true })
				}
				else
					displayPopupError({ display: true })
				displayTwoFAMenu(false)
			}
		}

		if (!userAuthenticate.twoFA)
			fetchTwoFAQRCode()

		const InputCodeContainer = inputCodeRef.current
		if (InputCodeContainer)
			InputCodeContainer.focus()
	}, [])

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

	/* ========================================================================== */

	return (
		<Style>
			<CloseButton closeFunction={displayTwoFAMenu} />
			<HorizontalSettingsForm
				onSubmit={handleSubmit}
				autoComplete="off"
				spellCheck="false">
				<HorizontalSetting>
					{
						!userAuthenticate.twoFA ?
							<>
								<QRCodeWrapper>
									{
										loader ?
											<Loader size={150} />
											:
											<QRCode src={qrCode} />
									}
								</QRCodeWrapper>
								<Message>
									Scan the QRcode and enter the six-digit code from Google Authenticator to enable double authentication
								</Message>
							</>
							:
							<Message>
								Enter the six-digit code from Google Authenticator to disable double authentication
							</Message>
					}
					<VerticalSettingWrapper>
						<InputText
							onChange={handleInputCode}
							onBlur={handleInputCodeBlur}
							type="text" value={code.value as string}
							width={150}
							fontSize={25}
							$error={code.error}
							ref={inputCodeRef} />
						<ErrorMessage>
							{code.error && code.errorMessage}
						</ErrorMessage>
					</VerticalSettingWrapper>
				</HorizontalSetting>
			</HorizontalSettingsForm>
		</Style>
	)
}

export default TwoFaMenu