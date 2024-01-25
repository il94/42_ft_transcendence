import { useContext, useEffect } from 'react'
import Cookies from "js-cookie"

import {
	HomePage,
	MainTitle,
	CentralWindow,
	StyledTitle,
	ButtonsWrapper
} from './style'

import LinkButton from '../../componentsLibrary/LinkButton'
import StyledLink from '../../componentsLibrary/StyledLink/Index'
import ActiveText from '../../componentsLibrary/ActiveText/Index'
import axios from 'axios'
import { useNavigate } from 'react-router'

import AuthContext from '../../contexts/AuthContext'

import colors from '../../utils/colors'

function Home() {

	const { token, setToken, url } = useContext(AuthContext)!
	const navigate = useNavigate();

	useEffect(() => {

		const access_token = Cookies.get('access_token')
		console.log("JAI UN TOKEN :", access_token)

		if (access_token)
		{
			localStorage.setItem('token', access_token)
			setToken(access_token)
		}		
	}, [])

	async function handleDeconnexionClickText() {
		try {

			await axios.get(`http://${url}:3333/auth/logout`, {
				headers: {
					'Authorization': `Bearer ${token}`
				}
			}) 
			
			Cookies.remove('access_token')

			localStorage.removeItem('token')
			setToken('')
			navigate("/")
		}
		catch (error) {
			console.log(error)
		}
	}

	return (
		<HomePage>
			<MainTitle>
				<StyledLink to="/">
					Transcendance
				</StyledLink>
			</MainTitle>
			<CentralWindow>
				<StyledTitle>
					Welcome
				</StyledTitle>
				{
					token ?
						<>
							<LinkButton
								to="/game" fontSize={35}
								alt="Game button" title="Game">
								Game !
							</LinkButton>
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
		</HomePage>
	)
}

export default Home