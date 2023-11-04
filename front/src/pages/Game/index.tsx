import { useState } from 'react'

import {
	GamePage,
	GameWrapper,
	TopGameWrapper,
	BottomGameWrapper
} from './style'

import Logo from '../../components/Logo'
import Info from '../../components/Info'
import Social from '../../components/Social'
import SocialReduce from '../../components/SocialReduce'
import Pong from '../../components/Pong'

function Game() {

	const [social, setSocial] = useState<boolean>(true)

	return (
		<GamePage>
			<GameWrapper>
				<TopGameWrapper>
					<Logo />
					<Info />
				</TopGameWrapper>
				<BottomGameWrapper>
					{
						social ? <SocialReduce setSocial={setSocial} />
							: <Social setSocial={setSocial} />
					}
					<Pong />
				</BottomGameWrapper>
			</GameWrapper>

		</GamePage>
	)

}

export default Game