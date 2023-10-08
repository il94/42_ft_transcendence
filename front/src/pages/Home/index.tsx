import { HomerWapper, StyledMainTitle, WelcomeWindow, StyledTitle, StyledLink } from './style'

function Home() {
	return (
		<HomerWapper>
			<StyledMainTitle>Transcendance</StyledMainTitle>
			<WelcomeWindow>
				<StyledTitle>Welcome</StyledTitle>
				<StyledLink to="/game" >Login</StyledLink>
			</WelcomeWindow>
		</HomerWapper>
	)
}

export default Home;
