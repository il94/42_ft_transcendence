import MediaQuery from 'react-responsive'

import { GamePage, BigGameWrapper, LeftWrapper, RightWrapper, LittleGameWrapper } from './style'

import Logo from '../../components/Logo'
import Info from '../../components/Info'
import Social from '../../components/Social'
import Pong from '../../components/Pong'

import breakpoints from '../../utils/breakpoints'

function Game() {

	return (
		<GamePage>

			<MediaQuery query={breakpoints.bigDesktop}>
				<BigGameWrapper>
					<LeftWrapper>
						<Logo />
						<Social />
					</LeftWrapper>
					<RightWrapper>
						<Info />
						<Pong />
					</RightWrapper>
				</BigGameWrapper>
			</MediaQuery>

			<MediaQuery query={breakpoints.smallDesktop}>
				<LittleGameWrapper>
					<Info />
					<Pong />
				</LittleGameWrapper>
			</MediaQuery>

		</GamePage>
	)

}

export default Game