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

import Logo from '../../components/Logo'
import Info from '../../components/Info'
import Social from '../../components/Social'
import Pong from '../../components/Pong'
import Profile from '../../components/Profile'
import Chat from '../../components/Chat'
import Card from '../../components/Card'

import breakpoints from '../../utils/breakpoints'

function Game() {

	const isSmallDesktop = useMediaQuery({ query: breakpoints.smallDesktop })

	const [social, displaySocial] = useState<boolean>(true)
	const [chat, displayChat] = useState<boolean>(false)
	const [contactListScrollValue, setContactListScrollValue] = useState<number>(0)
	const [chatScrollValue, setChatScrollValue] = useState<number>(0)
	const [chatRender, setChatRender] = useState<boolean>(false)
	const [card, displayCard] = useState<boolean>(false)
	const [cardPosition, setCardPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0})

	useEffect(() => {
		displaySocial(isSmallDesktop)
		if (!social)
			displayCard(false)
	}, [isSmallDesktop])

	return (
		<GamePage>
			{
				<GameWrapper>
					<LeftGameWrapper $social={social}>
						<Logo />
						<CardContext.Provider value={{ card, displayCard, setCardPosition }}>
							<Social social={social} displaySocial={displaySocial} />
						</CardContext.Provider>
					</LeftGameWrapper>
					<RightGameWrapper>
						<TopGameWrapper>
							<Info />
							<Profile displayCard={displayCard} setCardPosition={setCardPosition} />
						</TopGameWrapper>
						<BottomGameWrapper>
							<Pong />
							{
								card &&
								<Card cardPosition={cardPosition} />
							}
							{
								<ChatContext.Provider value={{ chat, displayChat, contactListScrollValue, setContactListScrollValue, chatScrollValue, setChatScrollValue, chatRender, setChatRender }}>
									<Chat />
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