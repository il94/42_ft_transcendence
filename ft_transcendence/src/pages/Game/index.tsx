import { styled } from 'styled-components'

import Logo from '../../components/Logo'
import Info from '../../components/Info'
import Profile from '../../components/Profile'
import Social from '../../components/Social'
import Pong from '../../components/Pong'
import Chat from '../../components/Chat'

import colors from '../../utils/colors'
import effects from '../../utils/effects'

const GamePage = styled.div`

	display: flex;
	justify-content: center;
	align-items: center;

	width: 100%;
	height: 100%;

	background-color: ${colors.background};
`

const GameWrapper = styled.div`
	display: grid;
	grid-template-columns: repeat(5, 1fr);
	grid-template-rows: 48px 802px;
	grid-column-gap: 0px;
	grid-row-gap: 0px;

	width: 1850px;
	height: 850px;

	/* width: 95%;
	height: 95%; */
	
	background-color: ${colors.backgroundWindow};
	clip-path: ${effects.pixelateBorder};
`


function Game() {
	return (
		<GamePage>
			<GameWrapper>
				<Logo />
				<Info />
				<Profile />
				<Social />
				<Pong />
				<Chat />
			</GameWrapper>
		</GamePage>
	)
}

export default Game