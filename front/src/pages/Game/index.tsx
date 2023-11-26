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

function Game() {

	const isSmallDesktop = useMediaQuery({ query: breakpoints.smallDesktop })

	const [social, displaySocial] = useState<boolean>(true)
	const [chat, displayChat] = useState<boolean>(false)
	const [contactListScrollValue, setRoomListScrollValue] = useState<number>(0)
	const [chatScrollValue, setChatScrollValue] = useState<number>(0)
	const [chatRender, setChatRender] = useState<boolean>(false)
	const [card, displayCard] = useState<boolean>(false)
	const [cardPosition, setCardPosition] = useState<{ top: string; left: string }>({ top: "0px", left: "0px" })
	const [cardUsername, setCardUserName] = useState<string>("")

	const [menuInteraction, displayMenuContextual] = useState<boolean>(false)
	const [menuInteractionPosition, setMenuContextualPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 })


	const [zCardIndex, setZCardIndex] = useState<number>(10)
	const [zChatIndex, setZChatIndex] = useState<number>(10)

	const [settings, displayMenuSettings] = useState<boolean>(false)

	// A récuperer depuis le back, valeurs randoms en attendant
	// const [userData, setUserData] = useState< User | undefined >()
	const [userData, setUserData] = useState< User | undefined >({ hash: "MDP LOL", username: "ilandols" })

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


	/* =========== TESTS ============== */

	// const [userData, setUserData] = useState<User>({})

	// useEffect(() => {
	// 	axios.get("http://localhost:3333/users")
	// 		.then((response) => {
	// 			setUserData(response.data[0])
	// 			console.log(userData)
	// 		})
	// 		.catch((error) => console.log(error))
	// }, [])

	/* ================================== */

	return (
		<GamePage>
			{
				<ZIndexContext.Provider value={{ zCardIndex, setZCardIndex, zChatIndex, setZChatIndex }}>
					<GameWrapper>
						<LeftGameWrapper $social={social}>
							<Logo />
							<MenuContextualContext.Provider value={{ menuInteraction, displayMenuContextual, menuInteractionPosition, setMenuContextualPosition }} >
								<CardContext.Provider value={{ card, displayCard, cardPosition, setCardPosition, cardUsername, setCardUserName }}>
									<Social social={social} displaySocial={displaySocial} />
								</CardContext.Provider>
							</MenuContextualContext.Provider>
						</LeftGameWrapper>
						<RightGameWrapper>
							<TopGameWrapper>
								<Info />
								<Profile username={userData?.username ? userData?.username : "Loading..."} displayCard={displayCard} setCardPosition={setCardPosition} settings={settings} displayMenuSettings={displayMenuSettings} />
							</TopGameWrapper>
							<BottomGameWrapper>
								<Pong />
								{
									card &&
									<CardContext.Provider value={{ card, displayCard, cardPosition, setCardPosition, cardUsername, setCardUserName }}>
										<Card username={cardUsername} cardPosition={cardPosition} />
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
									<MenuSettings displayMenuSettings={displayMenuSettings} userData={userData} />
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