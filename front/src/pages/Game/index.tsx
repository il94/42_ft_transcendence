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
	contactListScrollValue: number,
	setContactListScrollValue: React.Dispatch<React.SetStateAction<number>>,
	chatScrollValue: number,
	setChatScrollValue: React.Dispatch<React.SetStateAction<number>>,
	chatRender: boolean,
	setChatRender: React.Dispatch<React.SetStateAction<boolean>>
} | undefined>(undefined)

export const CardContext = createContext<{
	card: boolean,
	displayCard: React.Dispatch<React.SetStateAction<boolean>>,
	cardPosition: number,
	setCardPosition: React.Dispatch<React.SetStateAction<number>>
} | undefined >(undefined)





function Game() {
	
	const [reduceLeft, setReduce] = useState<boolean>(false)
	const [scrollValue, setScrollValue] = useState<number>(0)
	const [chat, displayChat] = useState<boolean>(false)
	const [contactListScrollValue, setContactListScrollValue] = useState<number>(0)
	const [chatScrollValue, setChatScrollValue] = useState<number>(0)
	const [chatRender, setChatRender] = useState<boolean>(false)
	const [card, displayCard] = useState<boolean>(false)
	const [cardPosition, setCardPosition] = useState<number>(0)


	const isSmallDesktop = useMediaQuery({ query: breakpoints.smallDesktop })

	useEffect(() => {
		if (isSmallDesktop === true)
			setReduce(true)
	}, [])

	return (
		<GamePage>
				<MediaQuery query={breakpoints.bigDesktop} onChange={(window) => {setReduce(!window); if (!window) displayCard(false)}} />
				{
					reduceLeft ?
						<GameWrapper>
							<ReduceLeftGameWrapper>
								<LogoReduce />
								<CardContext.Provider value={{card, displayCard, cardPosition, setCardPosition}}>
									<SocialReduce setReduce={setReduce} scrollValue={scrollValue} setScrollValue={setScrollValue} />
								</CardContext.Provider>
							</ReduceLeftGameWrapper>
							<ExtendRightGameWrapper>
								<TopGameWrapper>
									<Info />
									<Profile />
								</TopGameWrapper>
								<BottomGameWrapper>
									<ChatContext.Provider value={{ chat, displayChat, contactListScrollValue, setContactListScrollValue, chatScrollValue, setChatScrollValue, chatRender, setChatRender }}>
										<CardContext.Provider value={{card, displayCard, cardPosition, setCardPosition}}>
											<Pong />
										</CardContext.Provider>
									</ChatContext.Provider>
								</BottomGameWrapper>
							</ExtendRightGameWrapper>
						</GameWrapper>
						:
						<GameWrapper>
							<LeftGameWrapper>
								<Logo />
								<CardContext.Provider value={{card, displayCard, cardPosition, setCardPosition}}>
									<Social setReduce={setReduce} scrollValue={scrollValue} setScrollValue={setScrollValue} />
								</CardContext.Provider>
							</LeftGameWrapper>
							<RightGameWrapper>
								<TopGameWrapper>
									<Info />
									<Profile />
								</TopGameWrapper>
								<BottomGameWrapper>
									<ChatContext.Provider value={{ chat, displayChat, contactListScrollValue, setContactListScrollValue, chatScrollValue, setChatScrollValue, chatRender, setChatRender }}>
										<CardContext.Provider value={{card, displayCard, cardPosition, setCardPosition}}>
											<Pong />
										</CardContext.Provider>
									</ChatContext.Provider>
								</BottomGameWrapper>
							</RightGameWrapper>
						</GameWrapper>
				}
		</GamePage>
	)
}

export default Game