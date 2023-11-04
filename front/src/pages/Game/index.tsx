import { useEffect, useState } from 'react'

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
import MediaQuery, { useMediaQuery } from 'react-responsive'
import breakpoints from '../../utils/breakpoints'

function Game() {

	const [reduceLeft, setReduce] = useState<boolean>(false)

	const isSmallDesktop = useMediaQuery({ query: '(min-width: 0px) and (max-width: 1279px)' })

	useEffect(() => {
		if (isSmallDesktop === true)
			setReduce(true)
	}, [])

	return (
		<GamePage>
		<MediaQuery query={breakpoints.bigDesktop} onChange={ (isSmallWindow) => setReduce(!isSmallWindow) } />
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