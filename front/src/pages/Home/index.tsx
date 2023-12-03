import {
	HomePage,
	MainTitle,
	CentralWindow,
	StyledTitle,
	ButtonsWrapper
} from './style'

import LinkButton from '../../componentsLibrary/LinkButton'
import StyledLink from '../../componentsLibrary/StyledLink/Index'

import colors from '../../utils/colors'
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
			<CentralWindow>
				<StyledTitle>
					Welcome
				</StyledTitle>
				{
					isAuth ? 
					<ButtonsWrapper>
						<LinkButton to="/game" fontSize={35}>
							Game !
						</LinkButton>
					</ButtonsWrapper>
					:
					<ButtonsWrapper>
						<LinkButton to="/signin" width={165} fontSize={35}>
							Sign in
						</LinkButton>
						<LinkButton to="/signup" width={165} fontSize={35}>
							Sign up
						</LinkButton>
					</ButtonsWrapper>
				}
			</CentralWindow>
			<button onClick={() => setIsAuth(!isAuth)} style={{ color: "black" }}>
				Auth ?
			</button>
		</HomePage>
	)
}

export default Home