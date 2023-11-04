import { useState } from 'react'
import MediaQuery from 'react-responsive'

import { GamePage,
			BigGameWrapper,
			LeftWrapper,
			RightWrapper,
			LittleGameWrapper,
			TopGameWrapper,
			BottomGameWrapper } from './style'

import Logo from '../../components/Logo'
import Info from '../../components/Info'
import Social from '../../components/Social'
import SocialReduce from '../../components/SocialReduce'
import Pong from '../../components/Pong'

import breakpoints from '../../utils/breakpoints'

function Game() {

	const [social, setSocial] = useState<boolean>(true)

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
					<TopGameWrapper>
						<Logo />
						<Info />
					</TopGameWrapper>
					<BottomGameWrapper>
						{
							social	? <SocialReduce setSocial={setSocial} />
									: <Social setSocial={setSocial} />
						}
						<Pong />
					</BottomGameWrapper>
				</LittleGameWrapper>
			</MediaQuery>

		</GamePage>
	)

}

export default Game