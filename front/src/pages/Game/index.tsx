import { GamePage, GameWrapper } from './style'

import Logo from '../../components/Logo'
import Info from '../../components/Info'
import Social from '../../components/Social'
import Pong from '../../components/Pong'

function Game() {
	return (
		<GamePage>
			<GameWrapper>
				<Logo />
				<Info />
				<Social />
				<Pong />
			</GameWrapper>
		</GamePage>
	)
}

export default Game