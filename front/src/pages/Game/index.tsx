import { GamePage, GameWrapper, LeftWrapper, RightWrapper } from './style'

import Logo from '../../components/Logo'
import Info from '../../components/Info'
import Social from '../../components/Social'
import Pong from '../../components/Pong'

function Game() {
	return (
		<GamePage>
			<GameWrapper>
				<LeftWrapper>
					<Logo />
					<Social />
				</LeftWrapper>
				<RightWrapper>
					<Info />
					<Pong />
				</RightWrapper>
			</GameWrapper>
		</GamePage>
	)
}

export default Game