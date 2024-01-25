import { useContext, useEffect } from 'react'
import styled from 'styled-components'

import LinkButton from '../../componentsLibrary/LinkButton'
import StyledLink from '../../componentsLibrary/StyledLink/Index'
import ActiveText from '../../componentsLibrary/ActiveText/Index'

import AuthContext from '../../contexts/AuthContext'

import colors from '../../utils/colors'
import Page from '../../componentsLibrary/Page'
import MainTitle from '../../componentsLibrary/MainTitle'
import CentralWindow from '../../componentsLibrary/CentralWindow'
import WindowTitle from '../../componentsLibrary/WindowTitle'

const ButtonsWrapper = styled.div`

	display: flex;
	justify-content: space-evenly;

	width: 100%;

	padding-bottom: 15px;

`

function Home() {

	const { token, setToken } = useContext(AuthContext)!

	useEffect(() => {

		// Extraire la partie après "access_token="
		// const tokenString: string = document.cookie.indexOf("access_token")
		const index = document.cookie.indexOf("access_token=")

		const accessTokenString = document.cookie.slice(index + "access_token=".length);

		// console.log("LOL = ", accessTokenString)

		if (!localStorage.getItem("access_token")) {
			setToken(accessTokenString)
			localStorage.setItem("access_token", accessTokenString)
		}

	}, [])

	async function handleDeconnexionClickText() {
		localStorage.removeItem("access_token")
		setToken('')
	}

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
		</Page>
	)
}

export default Home