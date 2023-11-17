import React, { createContext, useEffect, useState } from 'react'
import MediaQuery, { useMediaQuery } from 'react-responsive'

import {
	GamePage,
	GameWrapper,
	TopGameWrapper,
	BottomGameWrapper,
	LeftGameWrapper,
	RightGameWrapper
} from './style'

import Logo from '../../components/Logo'
import LogoReduce from '../../components/Logo/LogoReduce'
import Info from '../../components/Info'
import Social from '../../components/Social'
import SocialReduce from '../../components/Social/SocialReduce'
import Pong from '../../components/Pong'
import Profile from '../../components/Profile'
import Chat from '../../components/Chat'
import ChatButton from '../../components/Chat/ChatButton'
import Card from '../../components/Card'

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
} | undefined>(undefined)

function Game() {

	const [social, displaySocial] = useState<boolean>(false)
	const [socialScrollValue, setSocialScrollValue] = useState<number>(0)
	const [chat, displayChat] = useState<boolean>(false)
	const [contactListScrollValue, setContactListScrollValue] = useState<number>(0)
	const [chatScrollValue, setChatScrollValue] = useState<number>(0)
	const [chatRender, setChatRender] = useState<boolean>(false)
	const [card, displayCard] = useState<boolean>(false)
	const [cardPosition, setCardPosition] = useState<number>(0)


	const isSmallDesktop = useMediaQuery({ query: breakpoints.smallDesktop })

	useEffect(() => {
		if (isSmallDesktop === true)
			displaySocial(true)
	}, [])

	return (
		<GamePage>
			<MediaQuery query={breakpoints.bigDesktop} onChange={(window) => { displaySocial(!window); !window && displayCard(false) }} />
			{
				<GameWrapper>
					<LeftGameWrapper $social={social}>
						{
							social ?
								<CardContext.Provider value={{ card, displayCard, cardPosition, setCardPosition }}>
									<LogoReduce />
									<SocialReduce displaySocial={displaySocial} socialScrollValue={socialScrollValue} setSocialScrollValue={setSocialScrollValue} />
								</CardContext.Provider>
								:
								<CardContext.Provider value={{ card, displayCard, cardPosition, setCardPosition }}>
									<Logo />
									<Social displaySocial={displaySocial} socialScrollValue={socialScrollValue} setSocialScrollValue={setSocialScrollValue} />
								</CardContext.Provider>
						}
					</LeftGameWrapper>
					<RightGameWrapper>
						<TopGameWrapper>
							<Info />
							<Profile />
						</TopGameWrapper>
						<BottomGameWrapper>
								<Pong />
								{
									card &&
										<CardContext.Provider value={{ card, displayCard, cardPosition, setCardPosition }}>
											<Card />
										</CardContext.Provider>
								}
								{
									chat ?
										<ChatContext.Provider value={{ chat, displayChat, contactListScrollValue, setContactListScrollValue, chatScrollValue, setChatScrollValue, chatRender, setChatRender }}>
											<Chat />
										</ChatContext.Provider>
										:
										<ChatContext.Provider value={{ chat, displayChat, contactListScrollValue, setContactListScrollValue, chatScrollValue, setChatScrollValue, chatRender, setChatRender }}>
											<ChatButton />
										</ChatContext.Provider>
								}
						</BottomGameWrapper>
					</RightGameWrapper>
				</GameWrapper>
			}
		</GamePage>
	)
}

export default Game