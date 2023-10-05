import styled from 'styled-components'
import { Link } from 'react-router-dom'

import colors from '../../utils/colors'
import effects from '../../utils/effects'

const HomerWapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
`

const WelcomeWindow = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;

	font-size: 10%;
	width: 400px;
	margin-top: 25vh;
	margin-bottom: 25vh;
	background-color: ${colors.backgroundWindow};

	border-style: solid;
	border-width: 15px;
	border-color: ${colors.backgroundWindow};
	box-shadow: 10px;

	clip-path: ${effects.pixelateBorder};
`

const StyledMainTitle = styled.h1`
	font-size: 80px;

	&:hover {
		transform: scale(1.015);
	}
`

const StyledTitle = styled.h2`
	margin: 10px;
	font-size: 45px;

	&:hover {
		transform: scale(1.015);
	}
`

const StyledLink = styled(Link)`
	font-size: 40px;
	margin: 10px;
	padding: 1px;
	padding-bottom: 3px;
	padding-right: 3px;

	background-color: ${colors.button};
	color: ${colors.text};

	cursor: pointer;

	text-decoration: none;
	border-style: solid;
	border-width: 5px;
	border-color: ${colors.button} ${colors.shadowButton} ${colors.shadowButton} ${colors.button};
	clip-path: ${effects.pixelateBorder};
	
	&:hover {
		transform: scale(1.015);
	}
	&:active {
		transform: scale(0.95);
		transform: translate(2px, 2px);
		background-color: ${colors.shadowButton};
		border-color: ${colors.shadowButton};
	}
`

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
