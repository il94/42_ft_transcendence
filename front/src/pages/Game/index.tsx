import {
	useContext,
	useEffect,
	useRef,
	useState
} from 'react'
import { useMediaQuery } from 'react-responsive'
import axios, { AxiosResponse } from 'axios'
import io from 'socket.io-client';

import {
	GamePage,
	GameWrapper,
	TopGameWrapper,
	BottomGameWrapper,
	LeftGameWrapper,
	RightGameWrapper
} from './style'

import Logo from '../../components/Logo'
import SearchBarWrapper from '../../components/SearchBar/SearchBarWrapper'
import Social from '../../components/Social'
import Pong from '../../components/Pong'
import Profile from '../../components/Profile'
import Chat from '../../components/Chat'
import Card from '../../components/Card'
import TestsBack from '../../components/TestsBack'
import SettingsMenu from '../../components/SettingsMenu'
import ContextualMenu from '../../components/ContextualMenus/ContextualMenu'
import SecondaryContextualMenu from '../../components/ContextualMenus/SecondaryContextualMenu'
import ErrorContextualMenu from '../../components/ContextualMenus/ErrorContextualMenu'

import ErrorRequest from '../../componentsLibrary/ErrorRequest'

import CardContext from '../../contexts/CardContext'
import ChatContext from '../../contexts/ChatContext'
import ContextualMenuContext from '../../contexts/ContextualMenuContext'
import DisplayContext from '../../contexts/DisplayContext'
import InteractionContext from '../../contexts/InteractionContext'
import AuthContext from '../../contexts/AuthContext'

import { Channel, User, UserAuthenticate } from '../../utils/types'
import { chatWindowStatus, contextualMenuStatus, userStatus } from '../../utils/status'
import { emptyUser, emptyUserAuthenticate } from '../../utils/emptyObjects'

import breakpoints from '../../utils/breakpoints'

import { TempContext, userSomeone } from '../../temp/temp'

function Game() {

	function getSecondaryContextualMenuHeight(numberOfChannels: number) {
		const maxHeight = window.innerHeight * 95 / 100 // taille max possible (height de la fenetre de jeu)

		if (numberOfChannels * 35 < maxHeight) // verifie si la taille max n'est pas depassee
			setSecondaryContextualMenuHeight(numberOfChannels * 35) // 35 = height d'une section
		else
			setSecondaryContextualMenuHeight(maxHeight) // height max
	}

	function closeContextualMenus() {
		displayContextualMenu({ display: false, type: undefined })
		displaySecondaryContextualMenu(false)
		if (searchBarResults)
			displaySearchBarResults(false)
	}

	/* ============================== AUTH STATES =============================== */

	const [userTarget, setUserTarget] = useState<User | UserAuthenticate>(emptyUser)
	const [userAuthenticate, setUserAuthenticate] = useState<UserAuthenticate>(emptyUserAuthenticate)
	const [channelTarget, setChannelTarget] = useState<Channel | undefined>(undefined)

	const { token } = useContext(AuthContext)!
	const [errorRequest, setErrorRequest] = useState<boolean>(false)

	useEffect(() => {
		async function fetchFriends(): Promise<User[]> {
			try {

				/* ============ Temporaire ============== */

				// appeler la route qui recupere les amis du user
				// const friendsResponse = await axios.get("http://localhost:3333/user/me/friends")

				const friendsResponse: AxiosResponse<[]> = await axios.get("http://localhost:3333/user", {
					headers: {
						'Authorization': `Bearer ${token}`
					}
				})

				/* ====================================== */

				const friends: User[] = friendsResponse.data.map((friend: any) => {

					const { wins, draws, losses, ...rest } = friend

					return {
						...rest,
						scoreResume: {
							wins: wins,
							draws: draws,
							losses: losses
						}
					}
				})

				return (friends)
			}
			catch (error) {
				throw (error)
			}
		}

		async function fetchChannels(): Promise<Channel[]> {
			try {
				const channelsResponse: AxiosResponse<[]> = await axios.get("http://localhost:3333/user/channels", {
					headers: {
						'Authorization': `Bearer ${token}`
					}
				})

				const channels: Channel[] = channelsResponse.data.map((channel: Channel) => ({
					...channel,
					messages: [],
					owner: emptyUser,
					administrators: [],
					users: [],
					validUsers: [],
					mutedUsers: [],
					bannedUsers: []

				}))

				return (channels)
			}
			catch (error) {
				throw (error)
			}
		}

		async function fetchMe() {
			try {
				const friends: User[] = await fetchFriends()
				const channels: Channel[] = await fetchChannels()

				const responseMe: AxiosResponse = await axios.get("http://localhost:3333/user/me", {
					headers: {
						'Authorization': `Bearer ${token}`
					}
				})

				const socket = io('http://localhost:3333', {
					transports: ["websocket"],
					query: {
						id: responseMe.data.id,
					}
					});
		
				socket.on('connect_error', (error) => {
					console.error('Erreur de connexion à la socket :', error.message);
					throw new Error;
				});
				
				setUserAuthenticate({
					id: responseMe.data.id,
					username: responseMe.data.username,
					avatar: responseMe.data.avatar,
					status: userStatus.ONLINE,
					scoreResume: {
						wins: responseMe.data.wins,
						draws: responseMe.data.draws,
						losses: responseMe.data.losses
					},
					email: responseMe.data.email,
					phoneNumber: responseMe.data.phoneNumber,
					twoFA: responseMe.data.twoFA,
					friends: [], // a recuperer depuis la reponse
					blockedUsers: [], // a recuperer depuis la reponse
					channels: channels, // a recuperer depuis la reponse
					socket: socket
				})
			}
			catch (error) {

				// temporaire
				// Si la socket doit etre close manuellement, il la close ici en cas d'erreur au lancement

				localStorage.removeItem('token')
				setErrorRequest(true)
			}
		}
		fetchMe()
	}, [])

	useEffect(() => {
		getSecondaryContextualMenuHeight(userAuthenticate.channels.length)
	}, [userAuthenticate.channels.length])

	/* ========================== COMPONENTS STATES ============================= */

	const [social, displaySocial] = useState<boolean>(true)

	const [chat, displayChat] = useState<boolean>(false)
	const [channelListScrollValue, setChannelListScrollValue] = useState<number>(0)
	const [chatScrollValue, setChatScrollValue] = useState<number>(0)
	const [chatRender, setChatRender] = useState<boolean>(false)
	const [chatWindowState, setChatWindowState] = useState<chatWindowStatus>(chatWindowStatus.HOME)

	const [card, displayCard] = useState<boolean>(false)
	const [cardPosition, setCardPosition] = useState<{ left?: number; right?: number; top?: number; bottom?: number }>({ left: 0, right: 0, top: 0, bottom: 0 })

	const [contextualMenu, displayContextualMenu] = useState<{ display: boolean; type: contextualMenuStatus | undefined }>({ display: false, type: undefined })
	const [contextualMenuPosition, setContextualMenuPosition] = useState<{ left?: number; right?: number; top?: number; bottom?: number }>({ left: 0, right: 0, top: 0, bottom: 0 })
	const [secondaryContextualMenu, displaySecondaryContextualMenu] = useState<boolean>(false)
	const [secondaryContextualMenuPosition, setSecondaryContextualMenuPosition] = useState<{ left?: number; right?: number; top?: number; bottom?: number }>({ left: 0, right: 0, top: 0, bottom: 0 })
	const [secondaryContextualMenuHeight, setSecondaryContextualMenuHeight] = useState<number>(0)
	const [errorContextualMenu, displayErrorContextualMenu] = useState<boolean>(false)

	const [searchBarResults, displaySearchBarResults] = useState<boolean>(false)

	const [settings, displaySettingsMenu] = useState<boolean>(false)

	/* ============================ DISPLAY STATES ============================== */

	const GameWrapperRef = useRef(null)
	const isSmallDesktop = useMediaQuery({ query: breakpoints.smallDesktop })

	useEffect(() => {
		displaySocial(isSmallDesktop)
		if (!social)
			displayCard(false)
	}, [isSmallDesktop])

	const [zCardIndex, setZCardIndex] = useState<number>(0)
	const [zChatIndex, setZChatIndex] = useState<number>(0)
	const [zSettingsIndex, setZSettingsIndex] = useState<number>(0)
	const [zMaxIndex, setZMaxIndex] = useState<number>(0)

	useEffect(() => {
		if (zCardIndex > 0 && zChatIndex > 0 && zSettingsIndex > 0) {
			setZCardIndex(zCardIndex - 1)
			setZChatIndex(zChatIndex - 1)
			setZSettingsIndex(zSettingsIndex - 1)
		}
		setZMaxIndex(Math.max(zCardIndex, zChatIndex, zSettingsIndex))
	}, [zCardIndex, zChatIndex, zSettingsIndex])
		
	useEffect(() => {
		window.addEventListener('resize', closeContextualMenus);

		return () => {
			window.removeEventListener('resize', closeContextualMenus);
		}
	}, [])
	

	/* ========================================================================== */

	return (
		<TempContext.Provider value={{ userSomeone }}>
			<GamePage
				onClick={closeContextualMenus}>
				{
					!errorRequest ?
						<InteractionContext.Provider value={{ userAuthenticate, setUserAuthenticate, userTarget, setUserTarget, channelTarget, setChannelTarget }}>
							<DisplayContext.Provider value={{ zCardIndex, setZCardIndex, zChatIndex, setZChatIndex, zSettingsIndex, setZSettingsIndex, zMaxIndex, setZMaxIndex, GameWrapperRef }}>
								<GameWrapper ref={GameWrapperRef}>
									{
										contextualMenu.display &&
										<ContextualMenu
											type={contextualMenu.type}
											displayContextualMenu={displayContextualMenu}
											contextualMenuPosition={contextualMenuPosition}
											userTarget={userTarget}
											displaySecondaryContextualMenu={displaySecondaryContextualMenu}
											setSecondaryContextualMenuPosition={setSecondaryContextualMenuPosition}
											secondaryContextualMenuHeight={secondaryContextualMenuHeight}
											displayErrorContextualMenu={displayErrorContextualMenu}
											displayChat={displayChat} />
									}
									{
										secondaryContextualMenu &&
										<SecondaryContextualMenu
											displaySecondaryContextualMenu={displaySecondaryContextualMenu}
											userTarget={userTarget}
											secondaryContextualMenuPosition={secondaryContextualMenuPosition}
											secondaryContextualMenuHeight={secondaryContextualMenuHeight}
											channels={userAuthenticate.channels}
											displayErrorContextualMenu={displayErrorContextualMenu} />
									}
									{
										errorContextualMenu &&
										<ErrorContextualMenu
											displayErrorContextualMenu={displayErrorContextualMenu}
											errorContextualMenuPosition={contextualMenuPosition} />
									}
									<LeftGameWrapper $social={social}>
										<Logo social={social} />
										<CardContext.Provider value={{ card, displayCard, cardPosition, setCardPosition }}>
											<Social
												social={social}
												displaySocial={displaySocial}
												friends={userAuthenticate.friends}
												displayContextualMenu={displayContextualMenu}
												setContextualMenuPosition={setContextualMenuPosition} />
										</CardContext.Provider>
									</LeftGameWrapper>
									<RightGameWrapper>
										<TopGameWrapper>
											<SearchBarWrapper
												searchBarResults={searchBarResults}
												displaySearchBarResults={displaySearchBarResults}
												displayChat={displayChat} />
											<Profile
												userAuthenticate={userAuthenticate}
												card={card}
												userTarget={userTarget}
												setUserTarget={setUserTarget}
												displayCard={displayCard}
												setCardPosition={setCardPosition}
												settings={settings}
												displaySettingsMenu={displaySettingsMenu} />
										</TopGameWrapper>
										<BottomGameWrapper>
											<Pong />
											{
												card &&
												<Card
													cardPosition={cardPosition}
													displayCard={displayCard}
													userTarget={userTarget} />
											}
											{
												settings &&
												<SettingsMenu
													userAuthenticate={userAuthenticate}
													displaySettingsMenu={displaySettingsMenu} />
											}
											<TestsBack />
											{
												<ContextualMenuContext.Provider value={{ contextualMenu, displayContextualMenu, contextualMenuPosition, setContextualMenuPosition, secondaryContextualMenuHeight, setSecondaryContextualMenuHeight }}>
													<CardContext.Provider value={{ card, displayCard, cardPosition, setCardPosition }}>
														<ChatContext.Provider value={{ chat, displayChat, channelListScrollValue, setChannelListScrollValue, chatScrollValue, setChatScrollValue, chatRender, setChatRender }}>
															<Chat
																chat={chat}
																displayChat={displayChat}
																channels={userAuthenticate.channels}
																channelTarget={channelTarget}
																setChannelTarget={setChannelTarget}
																chatWindowState={chatWindowState}
																setChatWindowState={setChatWindowState}
																userAuthenticate={userAuthenticate} />
														</ChatContext.Provider>
													</CardContext.Provider>
												</ContextualMenuContext.Provider>
											}
										</BottomGameWrapper>
									</RightGameWrapper>
								</GameWrapper>
							</DisplayContext.Provider>
						</InteractionContext.Provider>
						:
						<ErrorRequest />
				}
			</GamePage>
		</TempContext.Provider>
	)
}

export default Game