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
import SettingsPopup from '../../components/SettingsPopup'
import InteractionPopup from '../../components/InteractionPopup'
import axios from 'axios'
import { User } from '../../utils/types'
import TestsBack from '../../components/TestsBack'

function Game() {

	const isSmallDesktop = useMediaQuery({ query: breakpoints.smallDesktop })

	const [social, displaySocial] = useState<boolean>(true)
	const [chat, displayChat] = useState<boolean>(false)
	const [contactListScrollValue, setContactListScrollValue] = useState<number>(0)
	const [chatScrollValue, setChatScrollValue] = useState<number>(0)
	const [chatRender, setChatRender] = useState<boolean>(false)
	const [card, displayCard] = useState<boolean>(false)
	const [cardPosition, setCardPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 })
	const [cardUsername, setCardUserName] = useState<string>("")

	const [zCardIndex, setZCardIndex] = useState<number>(10)
	const [zChatIndex, setZChatIndex] = useState<number>(10)

	const [settings, displaySettings] = useState<boolean>(false)

	const [userCurrent, setUserCurrent] = useState<User>({})

	useEffect(() => {
		displaySocial(isSmallDesktop)
		if (!social)
			displayCard(false)
	}, [isSmallDesktop])

	useEffect(() => {
		if (zCardIndex > 1 && zChatIndex > 1)
		{
			setZCardIndex(zCardIndex - 1)
			setZChatIndex(zChatIndex - 1)
		}
	}, [zCardIndex, zChatIndex])

	useEffect(() => {
		axios.get("http://localhost:3333/users")
			.then((response) => {
				setUserCurrent(response.data[0])
				console.log(userCurrent)
			})
			.catch((error) => console.log(error))
	}, [])

	return (
		<GamePage>
			{
				<GameWrapper>
					<ZIndexContext.Provider value={{ zCardIndex, setZCardIndex, zChatIndex, setZChatIndex }}>
						<LeftGameWrapper $social={social}>
							<Logo />
							<CardContext.Provider value={{ card, displayCard, cardPosition, setCardPosition, cardUsername, setCardUserName }}>
								<Social social={social} displaySocial={displaySocial} />
							</CardContext.Provider>
						</LeftGameWrapper>
						<RightGameWrapper>
							<TopGameWrapper>
								<Info />
								<Profile username={userCurrent?.username ? userCurrent?.username : "Loading..."} displayCard={displayCard} setCardPosition={setCardPosition} settings={settings} displaySettings={displaySettings} />
							</TopGameWrapper>
							<BottomGameWrapper>
								<Pong />
								{
									card &&
									<CardContext.Provider value={{ card, displayCard, cardPosition, setCardPosition, cardUsername, setCardUserName }}>
										<Card username={cardUsername} cardPosition={cardPosition} />
									</CardContext.Provider>
								}
								{
									<InteractionPopup />
								}
									<TestsBack />
								{
									<ChatContext.Provider value={{ chat, displayChat, contactListScrollValue, setContactListScrollValue, chatScrollValue, setChatScrollValue, chatRender, setChatRender }}>
										<Chat />
									</ChatContext.Provider>
								}
								{
									settings &&
									<SettingsPopup displaySettings={displaySettings} />
								}
							</BottomGameWrapper>
						</RightGameWrapper>
					</ZIndexContext.Provider>
				</GameWrapper>
			}
		</GamePage>
	)
}

export default Game