import { HomePage, StyledMainTitle, WelcomeWindow, StyledTitle, StyledLink } from './style'

function Home() {
	return (
		<HomePage>
			<StyledMainTitle>
				Transcendance
			</StyledMainTitle>
			<WelcomeWindow>
				<StyledTitle>Welcome</StyledTitle>
				<StyledLink to="/game" >Login</StyledLink>
			</WelcomeWindow>
		</HomePage>
	)
}

export default Home;
