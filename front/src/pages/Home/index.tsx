import {
	HomePage,
	MainTitle,
	CentralWindow,
	StyledTitle,
	ButtonsWrapper
} from './style'

import LinkButton from '../../componentsLibrary/LinkButton'
import StyledLink from '../../componentsLibrary/StyledLink/Index'

import { useState } from 'react'

function Home() {

	/* ============ Temporaire ============== */

	// Savoir si l'utilisateur est authentifie

	const [isAuth, setIsAuth] = useState<boolean>(false)

	/* ============================================== */


	return (
		<HomePage>
			<MainTitle>
				<StyledLink to="/">
					Transcendance
				</StyledLink>
			</MainTitle>
			<button onClick={() => setIsAuth(!isAuth)} style={{ color: "black" }}>
				Auth ?
			</button>
			<CentralWindow>
				<StyledTitle>
					Welcome
				</StyledTitle>
				{
					isAuth ?
						<ButtonsWrapper>
							<LinkButton
								to="/game" fontSize={35}
								alt="Game button" title="Game">
								Game !
							</LinkButton>
						</ButtonsWrapper>
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