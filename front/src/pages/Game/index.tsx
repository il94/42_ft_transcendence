import {
	useEffect,
	useState
} from 'react'

import { useMediaQuery } from 'react-responsive'

import {
	GamePage,
	GameWrapper,
	TopGameWrapper,
	BottomGameWrapper,
	LeftGameWrapper,
	RightGameWrapper
} from './style'

import CardContext from '../../contexts/CardContext'
import ChatContext from '../../contexts/ChatContext'
import ZIndexContext from '../../contexts/ZIndexContext'

import Logo from '../../components/Logo'
import Info from '../../components/Info'
import Social from '../../components/Social'
import Pong from '../../components/Pong'
import Profile from '../../components/Profile'
import Chat from '../../components/Chat'
import Card from '../../components/Card'

import breakpoints from '../../utils/breakpoints'
import MenuSettings from '../../components/MenuSettings'
import axios from 'axios'
import { User } from '../../utils/types'
import TestsBack from '../../components/TestsBack'
import MenuContextualContext from '../../contexts/MenuContextualContext'

import DefaultProfilePicture from "../../assets/default_blue.png"

function Game() {

	const isSmallDesktop = useMediaQuery({ query: breakpoints.smallDesktop })

	const [social, displaySocial] = useState<boolean>(true)
	const [chat, displayChat] = useState<boolean>(false)
	const [contactListScrollValue, setRoomListScrollValue] = useState<number>(0)
	const [chatScrollValue, setChatScrollValue] = useState<number>(0)
	const [chatRender, setChatRender] = useState<boolean>(false)
	const [card, displayCard] = useState<boolean>(false)
	const [cardPosition, setCardPosition] = useState<{ top: string; left: string }>({ top: "0px", left: "0px" })
	const [cardIdTarget, setIdTargetCard] = useState<number>(0)

	const [menuInteraction, displayMenuContextual] = useState<boolean>(false)
	const [menuInteractionPosition, setMenuContextualPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 })


	const [zCardIndex, setZCardIndex] = useState<number>(10)
	const [zChatIndex, setZChatIndex] = useState<number>(10)

	const [settings, displayMenuSettings] = useState<boolean>(false)

	useEffect(() => {
		displaySocial(isSmallDesktop)
		if (!social)
			displayCard(false)
	}, [isSmallDesktop])

	useEffect(() => {
		if (zCardIndex > 1 && zChatIndex > 1) {
			setZCardIndex(zCardIndex - 1)
			setZChatIndex(zChatIndex - 1)
		}
	}, [zCardIndex, zChatIndex])


	/* ============ Temporaire ============== */

	// Recup le User authentifie avec un truc du style
	// axios.get("http://localhost:3333/user")

	const userTest: User = {
		profilePicture: DefaultProfilePicture,
		hash: "password",
		id: 0,
		username: "ilandols",
		state: "En ligne",
		scoreResume: {
			wins: 100,
			draws: 1,
			looses: 0	
		}
	}

	/* ============================================== */



	return (
		<GamePage>
			{
				<ZIndexContext.Provider value={{ zCardIndex, setZCardIndex, zChatIndex, setZChatIndex }}>
					<GameWrapper>
						<LeftGameWrapper $social={social}>
							<Logo />
							<MenuContextualContext.Provider value={{ menuInteraction, displayMenuContextual, menuInteractionPosition, setMenuContextualPosition }} >
								<CardContext.Provider value={{ card, displayCard, cardPosition, setCardPosition, cardIdTarget, setIdTargetCard }}>
									<Social social={social} displaySocial={displaySocial} />
								</CardContext.Provider>
							</MenuContextualContext.Provider>
						</LeftGameWrapper>
						<RightGameWrapper>
							<TopGameWrapper>
								<Info />
								<Profile

									userData={{
										id: userTest.id,
										username: userTest.username,
										profilePicture: userTest.profilePicture,
										scoreResume: userTest.scoreResume
									}}

									card={card}
									cardIdTarget={cardIdTarget}
									setIdTargetCard={setIdTargetCard}
									displayCard={displayCard}
									setCardPosition={setCardPosition}
									settings={settings}
									displayMenuSettings={displayMenuSettings}
								/>
							</TopGameWrapper>
							<BottomGameWrapper>
								<Pong />
								{
									card &&
									<CardContext.Provider value={{ card, displayCard, cardPosition, setCardPosition, cardIdTarget, setIdTargetCard }}>
										<Card cardPosition={cardPosition} />
									</CardContext.Provider>
								}
								<TestsBack />
								{
									<ChatContext.Provider value={{ chat, displayChat, contactListScrollValue, setRoomListScrollValue, chatScrollValue, setChatScrollValue, chatRender, setChatRender }}>
										<Chat />
									</ChatContext.Provider>
								}
								{
									settings &&
									<MenuSettings displayMenuSettings={displayMenuSettings} userData={{ username: userTest.username, profilePicture: userTest.profilePicture
									}} />
								}
							</BottomGameWrapper>
						</RightGameWrapper>
					</GameWrapper>
				</ZIndexContext.Provider>
			}
		</GamePage>
	)
}

export default Game