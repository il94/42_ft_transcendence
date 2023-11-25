import {
	HomePage,
	MainTitle,
	CentralWindow,
	StyledTitle,
	LinkButtonFix,
	ButtonsWrapper,
	StyledLink
} from './style'

import colors from '../../utils/colors'

function Home() {
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
				<ButtonsWrapper>
					<LinkButtonFix to="/signin" width="165px">
						Sign in
					</LinkButtonFix>
					<LinkButtonFix to="/signup" width="165px">
						Sign up
					</LinkButtonFix>
				</ButtonsWrapper>
			</CentralWindow>
		</HomePage>
	)
}

export default Home