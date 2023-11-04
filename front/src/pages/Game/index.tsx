import { useState } from 'react'

import {
	GamePage,
	GameWrapper,
	TopGameWrapper,
	BottomGameWrapper,
	LeftGameWrapper,
	RightGameWrapper,
	ReduceLeftGameWrapper,
	ExtendRightGameWrapper
} from './style'

import Logo from '../../components/Logo'
import LogoReduce from '../../components/LogoReduce'
import Info from '../../components/Info'
import Social from '../../components/Social'
import SocialReduce from '../../components/SocialReduce'
import Pong from '../../components/Pong'
import Profile from '../../components/Profile'

function Game() {

	const [reduceLeft, setReduce] = useState<boolean>(false)

	return (
		<GamePage>
		{
			reduceLeft ?
				<GameWrapper>
					<ReduceLeftGameWrapper>
						<LogoReduce />
						<SocialReduce setReduce={setReduce} />
					</ReduceLeftGameWrapper>
					<ExtendRightGameWrapper>
						<TopGameWrapper>
							<Info />
							<Profile />
						</TopGameWrapper>
						<BottomGameWrapper>
							<Pong />
						</BottomGameWrapper>
					</ExtendRightGameWrapper>
				</GameWrapper>
				:
				<GameWrapper>
					<LeftGameWrapper>
						<Logo />
						<Social setReduce={setReduce} />
					</LeftGameWrapper>
					<RightGameWrapper>
						<TopGameWrapper>
							<Info />
							<Profile />
						</TopGameWrapper>
						<BottomGameWrapper>
							<Pong />
						</BottomGameWrapper>
					</RightGameWrapper>
				</GameWrapper>
			}
		</GamePage>
	)

}

export default Game