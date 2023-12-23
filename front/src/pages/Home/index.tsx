import { useContext } from 'react'

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

import AuthContext from '../../contexts/AuthContext'

import colors from '../../utils/colors'

function Home() {

	const { token, setToken } = useContext(AuthContext)!

	async function handleDeconnexionClickText() {
		localStorage.removeItem('token')
		setToken('')
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