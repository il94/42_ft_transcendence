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

import Logo from '../../components/Logo'
import Info from '../../components/Info'
import Social from '../../components/Social'
import Pong from '../../components/Pong'
import Profile from '../../components/Profile'
import Chat from '../../components/Chat'
import Card from '../../components/Card'
import TestsBack from '../../components/TestsBack'
import MenuSettings from '../../components/MenuSettings'

import CardContext from '../../contexts/CardContext'
import ChatContext from '../../contexts/ChatContext'
import ZIndexContext from '../../contexts/ZIndexContext'
import MenuContextualContext from '../../contexts/MenuContextualContext'

import { UserAuthenticate } from '../../utils/types'

import breakpoints from '../../utils/breakpoints'

import DefaultProfilePicture from "../../assets/default_blue.png"

function Game() {

	const isSmallDesktop = useMediaQuery({ query: breakpoints.smallDesktop })

	const [social, displaySocial] = useState<boolean>(true)

	const [chat, displayChat] = useState<boolean>(false)
	const [contactListScrollValue, setChannelListScrollValue] = useState<number>(0)
	const [chatScrollValue, setChatScrollValue] = useState<number>(0)
	const [chatRender, setChatRender] = useState<boolean>(false)

	const [card, displayCard] = useState<boolean>(false)
	const [cardPosition, setCardPosition] = useState<{ top: string; left: string }>({ top: "0px", left: "0px" })
	const [cardIdTarget, setIdTargetCard] = useState<number>(0)

	const [menuContextual, displayMenuContextual] = useState<boolean>(false)
	const [menuContextualPosition, setMenuContextualPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 })


	const [contextualMenu, displayContextualMenu] = useState<boolean>(false)


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

	const userTest: UserAuthenticate = {
		id: 0,
		username: "ilandols",
		avatar: DefaultProfilePicture,
		state: "En ligne",
		scoreResume: {
			wins: 100,
			draws: 1,
			looses: 0	
		},
		hash: "password",
		email: "ilyes@test.fr",
		tel: "0000000000",
		createdAt: "???"
	}

	/* ============================================== */

	return (
		<GamePage>
			{
				<ZIndexContext.Provider value={{ zCardIndex, setZCardIndex, zChatIndex, setZChatIndex }}>
					<GameWrapper>
						{
							contextualMenu &&
							
						}
						<LeftGameWrapper $social={social}>
							<Logo />
								<CardContext.Provider value={{ card, displayCard, cardPosition, setCardPosition, cardIdTarget, setIdTargetCard }}>
								<Social
									social={social}
									displaySocial={displaySocial}
									menuContextual={menuContextual}
									displayMenuContextual={displayMenuContextual}
									menuContextualPosition={menuContextualPosition}
									setMenuContextualPosition={setMenuContextualPosition} />
								</CardContext.Provider>
						</LeftGameWrapper>
						<RightGameWrapper>
							<TopGameWrapper>
								<Info />
								<Profile
									userData={{
										id: userTest.id,
										username: userTest.username,
										profilePicture: userTest.avatar,
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
									<Card
										cardPosition={cardPosition}
										displayCard={displayCard}
									/>
								}
								<TestsBack />
								{
									<ChatContext.Provider value={{ chat, displayChat, contactListScrollValue, setChannelListScrollValue, chatScrollValue, setChatScrollValue, chatRender, setChatRender }}>
										<Chat />
									</ChatContext.Provider>
								}
								{
									settings &&
									<MenuSettings
										userData={{
											username: userTest.username,
											profilePicture: userTest.avatar
										}}
										displayMenuSettings={displayMenuSettings}
									/>
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