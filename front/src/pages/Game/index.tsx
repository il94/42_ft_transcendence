import { GamePage, GameWrapper } from './style'

import Logo from '../../components/Logo'
import Info from '../../components/Info'
import Profile from '../../components/Profile'
import Social from '../../components/Social'
import Pong from '../../components/Pong'
import Chat from '../../components/Chat'

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