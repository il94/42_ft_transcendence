import {
	ChangeEvent,
	FormEvent,
	useContext,
	useEffect,
	useState
} from 'react'
import { useNavigate } from 'react-router'
// import axios, { AxiosError } from 'axios'

import {
	SigninPage,
	MainTitle,
	CentralWindow,
	StyledTitle,
	SettingsForm,
	Setting,
	ErrorMessage
} from './style'

import StyledLink from '../../componentsLibrary/StyledLink/Index'
import Button from '../../componentsLibrary/Button'
import InputText from '../../componentsLibrary/InputText'
import ErrorRequest from '../../componentsLibrary/ErrorRequest'

import AuthContext from '../../contexts/AuthContext'

import { SettingData } from '../../utils/types'
import { emptySetting } from '../../utils/emptyObjects'

import colors from '../../utils/colors'
import axios from 'axios'

function TwoFA() {
	const [errorRequest, setErrorRequest] = useState<boolean>(false)
	const { token /*, setToken */ } = useContext(AuthContext)!
	const navigate = useNavigate()

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		try {
			event.preventDefault()
			if (code.value.length === 0)
			{
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
			// localStorage.setItem('token', response.data.access_token)

			/* ====================================== */
			
			navigate("/game")
		}
		catch (error) {
			//temporaire
			// checker si l'erreur vient d'un code invalide ou du serveur
			setErrorRequest(true)
			localStorage.removeItem('token')
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
				setErrorRequest(true)
			}
		}
		sendCode()
	}, [])

	useEffect(() => {
		if (token)
			setErrorRequest(true)
	}, [])

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
						TwoFA
					</StyledTitle>
					<SettingsForm
						onSubmit={handleSubmit}
						autoComplete="off"
						spellCheck="false">
						<Setting>
							Enter the temporary code received 
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
						<div style={{ marginTop: "10px" }} />
						<Button
							type="submit" fontSize={35}
							alt="Continue button" title="Continue">
							Continue
						</Button>
					</SettingsForm>
					<StyledLink to="/signin" color={colors.button}>
						Back
					</StyledLink>
				</>
				:
				<ErrorRequest />
			}
			</CentralWindow>
		</SigninPage>
	)
}

export default TwoFA