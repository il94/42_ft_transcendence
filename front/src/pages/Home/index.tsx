import {
	HomePage,
	MainTitle,
	CentralWindow,
	StyledTitle,
	ButtonsWrapper
} from './style'

import LinkButton from '../../componentsLibrary/LinkButton'
import LinkButtonFix from '../../componentsLibrary/LinkButtonFix'
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
				<StyledLink to="/" color={colors.text}>
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
						<LinkButton to="/game">
							Game !
						</LinkButton>
					</ButtonsWrapper>
					:
					<ButtonsWrapper>
						<LinkButtonFix to="/signin" width="165px">
							Sign in
						</LinkButtonFix>
						<LinkButtonFix to="/signup" width="165px">
							Sign up
						</LinkButtonFix>
					</ButtonsWrapper>
				}
			</CentralWindow>
			<button onClick={() => setIsAuth(!isAuth)}>
				Auth ?
			</button>
		</HomePage>
	)
}

export default Home