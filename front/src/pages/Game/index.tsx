import { useEffect, useState } from 'react'

import {
	GamePage,
	GameWrapper,
	TopGameWrapper,
	BottomGameWrapper
} from './style'

import Logo from '../../components/Logo'
import LogoReduce from '../../components/LogoReduce'
import Info from '../../components/Info'
import Social from '../../components/Social'
import SocialReduce from '../../components/SocialReduce'
import Pong from '../../components/Pong'
import Profile from '../../components/Profile'

function Game() {

	const [social, setSocial] = useState<boolean>(true)

	return (
		<GamePage>
			<GameWrapper>
				<TopGameWrapper>
					{
						social ? <Logo />
							: <LogoReduce />
					}
					<Info />
					<Profile />
				</TopGameWrapper>
				<BottomGameWrapper>
					{
						social ? <Social setSocial={setSocial} />
							: <SocialReduce setSocial={setSocial} />
					}
					<Pong />
				</BottomGameWrapper>
			</GameWrapper>

		</GamePage>
	)

}

export default Game