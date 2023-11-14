import React, { createContext, useEffect, useState } from 'react'
import MediaQuery, { useMediaQuery } from 'react-responsive'

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
import LogoReduce from '../../components/Logo/LogoReduce'
import Info from '../../components/Info'
import Social from '../../components/Social'
import SocialReduce from '../../components/Social/SocialReduce'
import Pong from '../../components/Pong'
import Profile from '../../components/Profile'

import breakpoints from '../../utils/breakpoints'

export const ChatContext = createContext<{
	chat: boolean,
	displayChat: React.Dispatch<React.SetStateAction<boolean>>,
	chatScrollValue: number,
	setChatScrollValue: React.Dispatch<React.SetStateAction<number>>,
	chatRender: boolean,
	setChatRender: React.Dispatch<React.SetStateAction<boolean>>
} | undefined>(undefined)

function Game() {

	const [reduceLeft, setReduce] = useState<boolean>(false)
	const [scrollValue, setScrollValue] = useState<number>(0)
	const [chat, displayChat] = useState<boolean>(false)
	const [chatScrollValue, setChatScrollValue] = useState<number>(0)
	const [chatRender, setChatRender] = useState<boolean>(false)

	const isSmallDesktop = useMediaQuery({ query: breakpoints.smallDesktop })

	useEffect(() => {
		if (isSmallDesktop === true)
			setReduce(true)
	}, [])

	return (
		<GamePage>
			<MediaQuery query={breakpoints.bigDesktop} onChange={(isSmallWindow) => setReduce(!isSmallWindow)} />
			{
				reduceLeft ?
					<GameWrapper>
						<ReduceLeftGameWrapper>
							<LogoReduce />
							<SocialReduce setReduce={setReduce} scrollValue={scrollValue} setScrollValue={setScrollValue} />
						</ReduceLeftGameWrapper>
						<ExtendRightGameWrapper>
							<TopGameWrapper>
								<Info />
								<Profile />
							</TopGameWrapper>
							<BottomGameWrapper>
								<ChatContext.Provider value={{ chat, displayChat, chatScrollValue, setChatScrollValue, chatRender, setChatRender }}>
									<Pong />
								</ChatContext.Provider>
							</BottomGameWrapper>
						</ExtendRightGameWrapper>
					</GameWrapper>
					:
					<GameWrapper>
						<LeftGameWrapper>
							<Logo />
							<Social setReduce={setReduce} scrollValue={scrollValue} setScrollValue={setScrollValue} />
						</LeftGameWrapper>
						<RightGameWrapper>
							<TopGameWrapper>
								<Info />
								<Profile />
							</TopGameWrapper>
							<BottomGameWrapper>
								<ChatContext.Provider value={{ chat, displayChat, chatScrollValue, setChatScrollValue, chatRender, setChatRender }}>
									<Pong />
								</ChatContext.Provider>
							</BottomGameWrapper>
						</RightGameWrapper>
					</GameWrapper>
			}
		</GamePage>
	)
}

export default Game