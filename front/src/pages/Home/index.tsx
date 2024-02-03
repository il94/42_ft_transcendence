import {
	useContext,
	useEffect,
	useRef
} from 'react'
import styled from 'styled-components'
import axios, { AxiosError } from 'axios'
import Cookies from "js-cookie"
import {
	useNavigate
} from 'react-router'

import LinkButton from '../../componentsLibrary/LinkButton'
import StyledLink from '../../componentsLibrary/StyledLink/Index'
import ActiveText from '../../componentsLibrary/ActiveText/Index'



import Page from '../../componentsLibrary/Page'
import MainTitle from '../../componentsLibrary/MainTitle'
import CentralWindow from '../../componentsLibrary/CentralWindow'
import WindowTitle from '../../componentsLibrary/WindowTitle'
import Button from '../../componentsLibrary/Button'

import AuthContext from '../../contexts/AuthContext'

import {
  ErrorResponse
} from '../../utils/types'

import colors from '../../utils/colors'

const ButtonsWrapper = styled.div`

	display: flex;
	justify-content: space-evenly;

	width: 100%;

	padding-bottom: 15px;

`

function Home() {

	const { token, setToken, url } = useContext(AuthContext)!
	const navigate = useNavigate();

	// Vérifie si le user est authentifié en récupérant le token soit par les cookies, soit en local
	useEffect(() => {
		const access_token: string | null | undefined = Cookies.get('access_token') ?
			Cookies.get('access_token')
			:
			localStorage.getItem('access_token')

		if (access_token)
		{
			localStorage.setItem('access_token', access_token)
			setToken(access_token)
		}
    else
      setToken('')

		const GameButtonContainer = gameButtonRef.current
		if (GameButtonContainer)
			GameButtonContainer.focus()

	}, [])

	// Déconnecte le user en supprimant son token des cookies et en local
	async function handleDeconnexionClickText() {
		try {
			await axios.get(`http://${url}:3333/auth/logout`, {
				headers: {
					'Authorization': `Bearer ${token}`
				}
			}) 
			Cookies.remove('access_token')
			Cookies.remove('userId')
			Cookies.remove('two_FA')
			Cookies.remove('isNew')
			localStorage.clear();
			setToken('')
			navigate("/")
		}
		catch (error) {
			if (axios.isAxiosError(error)) {
				const axiosError = error as AxiosError<ErrorResponse>
				const { statusCode } = axiosError.response?.data!
				console.log(error.message)
				console.log(statusCode)
			}
			else
				navigate("/error");
		}
	}

	const gameButtonRef = useRef<HTMLButtonElement>(null)

	return (
		<Page>
			<MainTitle>
				<StyledLink to="/">
					Transcendance
				</StyledLink>
			</MainTitle>
			<CentralWindow>
				<WindowTitle>
					Welcome
				</WindowTitle>
				{
					// TODO : isNew ? prompt settings form
					token ?
						<>
							<Button
								onClick={() => navigate("/game")}
								fontSize={35}
								alt="Game button" title="Game"
								ref={gameButtonRef}>
								Game !
							</Button>
							<ActiveText
								onClick={handleDeconnexionClickText}
								color={colors.button}>
								Disconnect
							</ActiveText>
						</>
						:
						<ButtonsWrapper>
							<LinkButton
								to="/signin" width={165} fontSize={35}
								alt="Sign in button" title="Sign in">
								Sign in
							</LinkButton>
							<LinkButton
								to="/signup" width={165} fontSize={35}
								alt="Sign up button" title="Sign up">
								Sign up
							</LinkButton>
						</ButtonsWrapper>
				}
			</CentralWindow>
		</Page>
	)
}

export default Home