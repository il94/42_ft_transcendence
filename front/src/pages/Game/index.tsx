import {
	useContext,
	useEffect,
	useRef,
	useState
} from 'react'
import { useNavigate } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'
import axios, { AxiosResponse } from 'axios'
import { io } from 'socket.io-client'

import {
	GamePage,
	GameWrapper,
	TopGameWrapper,
	BottomGameWrapper,
	LeftGameWrapper,
	RightGameWrapper
} from './style'

import {
	recieveChannelMP,
	refreshDeleteChannel,
	refreshLeaveChannel,
	refreshUpdateChannel,
	refreshUserStatus,
	postInvitation,
	refreshUserRole,
	refreshNewOwner,
	refreshJoinChannel,
	refreshStatusChallenge,
	refreshUserMute,
	postText
} from './sockets'

import Logo from '../../components/Logo'
import SearchBarWrapper from '../../components/SearchBar/SearchBarWrapper'
import Social from '../../components/Social'
import Pong from '../../components/Pong'
import PongWrapper from '../../components/Pong/PongWrapper'
import Profile from '../../components/Profile'
import Chat from '../../components/Chat'
import Card from '../../components/Card'
import TestsBack from '../../components/TestsBack'
import SettingsMenu from '../../components/SettingsMenu'
import TwoFaMenu from '../../components/TwoFaMenu'
import ContextualMenu from '../../components/ContextualMenus/ContextualMenu'
import SecondaryContextualMenu from '../../components/ContextualMenus/SecondaryContextualMenu'
import PopupError from '../../components/PopupError'
import Cookies from 'js-cookie'
import CardContext from '../../contexts/CardContext'
import ChatContext from '../../contexts/ChatContext'
import ContextualMenuContext from '../../contexts/ContextualMenuContext'
import DisplayContext from '../../contexts/DisplayContext'
import InteractionContext from '../../contexts/InteractionContext'
import AuthContext from '../../contexts/AuthContext'

import {
	Channel,
	User,
	UserAuthenticate
} from '../../utils/types'

import {
	challengeStatus,
	chatWindowStatus,
	contextualMenuStatus
} from '../../utils/status'

import {
	emptyUser,
	emptyUserAuthenticate
} from '../../utils/emptyObjects'

import breakpoints from '../../utils/breakpoints'

function Game() {

	const { token, url } = useContext(AuthContext)!

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
		if (popupError.display)
			displayPopupError({ display: false, message: undefined })
		if (searchBarResults)
			displaySearchBarResults(false)
	}

	/* ============================== AUTH STATES =============================== */

	const [userTarget, setUserTarget] = useState<User | UserAuthenticate>(emptyUser)
	const [userAuthenticate, setUserAuthenticate] = useState<UserAuthenticate>(emptyUserAuthenticate)
	const [channelTarget, setChannelTarget] = useState<Channel | undefined>(undefined)

	const navigate = useNavigate()

	useEffect(() => {

		async function fetchFriends(): Promise<User[]> {
			try {
				const friendsResponse: AxiosResponse<User[]> = await axios.get(`http://${url}:3333/friends`, {
					headers: {
						'Authorization': `Bearer ${token}`
					}
				})
				return (friendsResponse.data)
			}
			catch (error) {
				throw (error)
			}
		}

		async function fetchBlockedUsers(): Promise<User[]> {
			try {
				const blockedUsersResponse: AxiosResponse<User[]> = await axios.get(`http://${url}:3333/blockeds`, {
					headers: {
						'Authorization': `Bearer ${token}`
					}
				})

				return (blockedUsersResponse.data)
			}
			catch (error) {
				throw (error)
			}
		}

		async function fetchChannels(): Promise<Channel[]> {
			try {
				const channelsResponse: AxiosResponse<[]> = await axios.get(`http://${url}:3333/user/channels`, {
					headers: {
						'Authorization': `Bearer ${token}`
					}
				})

				const channels: Channel[] = channelsResponse.data.map((channel: Channel) => {
					return {
						...channel,
						messages: [],
						members: [],
						administrators: [],
						owner: undefined,
						banneds: [],
						muteInfo: []
					}
				})

				return (channels)
			}
			catch (error) {
				throw (error)
			}
		}

		async function fetchMe() {
			try {
				setLoaderFriends(true)
				setLoaderChannels(true)
				const meResponse: AxiosResponse = await axios.get(`http://${url}:3333/user/me`, {
					headers: {
						'Authorization': `Bearer ${token}`
					}
				})
				const friends: User[] = await fetchFriends()
				const blockeds: User[] = await fetchBlockedUsers()
				const channels: Channel[] = await fetchChannels()
				const socket = io(`http://${url}:3333`, {
					transports: ["websocket"],
					query: {
						id: meResponse.data.id,
					}
				});

				socket.on('connect_error', (error) => {
					console.error('Erreur de connexion à la socket :', error.message);
					throw new Error;
				});

				setUserAuthenticate({
					...meResponse.data,
					friends: friends,
					blockeds: blockeds,
					channels: channels,
					socket: socket
				})
				setLoaderChannels(false)
				setLoaderFriends(false)
			}
			catch (error) {
				navigate("/error", {
					state: {
						disconnect: true
					}
				})
			}
		}
		if (!token)
			navigate("/error")
		else
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
	
	const [popupError, displayPopupError] = useState<{ display: boolean, message?: string }>({ display: false, message: undefined })

	const [searchBarResults, displaySearchBarResults] = useState<boolean>(false)

	const [settings, displaySettingsMenu] = useState<boolean>(false)
	const [twoFAMenu, displayTwoFAMenu] = useState<boolean>(false)

	/* =============================== DISPLAY ================================== */

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

	const [loaderChannels, setLoaderChannels] = useState<boolean>(false)
	const [loaderChat, setLoaderChat] = useState<boolean>(false)
	const [loaderFriends, setLoaderFriends] = useState<boolean>(false)
	const [loaderResultsSearchBar, setLoaderResultsSearchBar] = useState<boolean>(false)
	const [loaderMatchsHistory, setLoaderMatchsHistory] = useState<boolean>(false)

	useEffect(() => {
		const isNew: string | undefined = Cookies.get('isNew');
		if (isNew === 'true') {
			displaySettingsMenu(true);
		}
		window.addEventListener('resize', closeContextualMenus);

		return () => {
			window.removeEventListener('resize', closeContextualMenus);
		}
	}, [])

	/* ========================= DISPLAY WITH SOCKETS =========================== */


	// CHAT
	useEffect(() => {

		// userAuthenticate.socket?.on("updateUserStatus", (userId: number, newStatus: any) => 
		// 	refreshUserStatus({ userId, newStatus, userAuthenticate, setUserAuthenticate, channelTarget, setChannelTarget }))

		userAuthenticate.socket?.on("updateChannel", (channelId: number, newDatas: number) => 
			refreshUpdateChannel({ channelId, newDatas, setUserAuthenticate, channelTarget, setChannelTarget }))
		userAuthenticate.socket?.on("deleteChannel", (channelId: number) =>
			refreshDeleteChannel({ channelId, setUserAuthenticate, channelTarget, setChannelTarget }))


			

		userAuthenticate.socket?.on("joinChannel", (channelId: number, userId: number) =>
			refreshJoinChannel({ channelId, userId, userAuthenticate, setUserAuthenticate, channelTarget, setChannelTarget, token, url }))




		userAuthenticate.socket?.on("postText", (channelId: number, userId: number, textDatas: any) => 
			postText({ channelId, userId, textDatas, channelTarget, setChannelTarget }))
		userAuthenticate.socket?.on("postInvitation", (channelId: number, userAuthId: number, userTargetId: number, invitationDatas: any) => 
			postInvitation({ channelId, userAuthId, userTargetId, invitationDatas, channelTarget, setChannelTarget }))
		userAuthenticate.socket?.on("leaveChannel", (channelId: number, userId: number) => 
			refreshLeaveChannel({ channelId, userId, userAuthenticate, setUserAuthenticate, channelTarget, setChannelTarget }))
		userAuthenticate.socket?.on("updateUserRole", (channelId: number, userId: number, newRole: any) =>
			refreshUserRole({ channelId, userId, newRole, userAuthenticate, setUserAuthenticate, channelTarget, setChannelTarget }));
		userAuthenticate.socket?.on("setNewOwner", (channelId: number, userId: number) =>
			refreshNewOwner({ channelId, userId, userAuthenticate, setUserAuthenticate, channelTarget, setChannelTarget }));
		userAuthenticate.socket?.on("updateChallenge", (channelId: number, messageId: number, newStatus: challengeStatus) => 
			refreshStatusChallenge({ channelId, messageId, newStatus, channelTarget, setChannelTarget }));
		userAuthenticate.socket?.on("updateUserMute", (idChan: number, time: string) => 
			refreshUserMute({ idChan, time, userAuthenticate, channelTarget, setChannelTarget }));




		return () => {

			// userAuthenticate.socket?.off("updateUserStatus")

			userAuthenticate.socket?.off("updateChannel")
			userAuthenticate.socket?.off("deleteChannel")





			userAuthenticate.socket?.off("joinChannel")






			userAuthenticate.socket?.off("postText")
			userAuthenticate.socket?.off("postInvitation")
			userAuthenticate.socket?.off("leaveChannel")
			userAuthenticate.socket?.off("updateUserRole")
			userAuthenticate.socket?.off("setNewOwner")
			userAuthenticate.socket?.off("updateChallenge");
			userAuthenticate.socket?.off("updateUserMute");
		}

	}, [userAuthenticate.socket, channelTarget])


	// GAME
	useEffect(() => {
		userAuthenticate.socket?.on("updateUserStatus", (userId: number, newStatus: any) => 
			refreshUserStatus({ userId, newStatus, userAuthenticate, setUserAuthenticate, channelTarget, setChannelTarget }))

		userAuthenticate.socket?.on("updateChannel", (channelId: number, newDatas: number) => 
			refreshUpdateChannel({ channelId, newDatas, setUserAuthenticate, channelTarget, setChannelTarget }))
		userAuthenticate.socket?.on("deleteChannel", (channelId: number) =>
			refreshDeleteChannel({ channelId, setUserAuthenticate, channelTarget, setChannelTarget }))
		userAuthenticate.socket?.on("createChannelMP", (channelId: number, recipientId: number) =>
			recieveChannelMP({ channelId, recipientId, token, url, userAuthenticate, setUserAuthenticate, setChannelTarget, displayChat }))

		// userAuthenticate.socket?.on("joinChannel2", (channelId: number, userId: number) =>
		// 	refreshJoinChannel({ channelId, userId, userAuthenticate, setUserAuthenticate, channelTarget, setChannelTarget, token, url }))

		return () => {
			userAuthenticate.socket?.off("updateUserStatus")

			userAuthenticate.socket?.off("updateChannel")
			userAuthenticate.socket?.off("deleteChannel")
			userAuthenticate.socket?.off("createChannelMP")
			// userAuthenticate.socket?.off("joinChannel2")
		}

	}, [userAuthenticate.socket])

	/* ========================================================================== */

	return (
		<GamePage
			onClick={closeContextualMenus}>
			<InteractionContext.Provider value={{ userAuthenticate, setUserAuthenticate, userTarget, setUserTarget, channelTarget, setChannelTarget }}>
				<DisplayContext.Provider value={{ zCardIndex, setZCardIndex, zChatIndex, setZChatIndex, loaderChat, setLoaderChat, zSettingsIndex, setZSettingsIndex, zMaxIndex, setZMaxIndex, loaderChannels, setLoaderChannels, loaderFriends, setLoaderFriends, loaderResultsSearchBar, setLoaderResultsSearchBar, loaderMatchsHistory, setLoaderMatchsHistory, displayPopupError, GameWrapperRef }}>
					<GameWrapper ref={GameWrapperRef}>
						{
							contextualMenu.display &&
							<ContextualMenu
								type={contextualMenu.type}
								contextualMenuPosition={contextualMenuPosition}
								displaySecondaryContextualMenu={displaySecondaryContextualMenu}
								setSecondaryContextualMenuPosition={setSecondaryContextualMenuPosition}
								secondaryContextualMenuHeight={secondaryContextualMenuHeight}
								displayChat={displayChat} />
						}
						{
							secondaryContextualMenu &&
							<SecondaryContextualMenu
								displaySecondaryContextualMenu={displaySecondaryContextualMenu}
								secondaryContextualMenuPosition={secondaryContextualMenuPosition}
								secondaryContextualMenuHeight={secondaryContextualMenuHeight}
								channels={userAuthenticate.channels} />
						}
						{
							popupError.display &&
							<PopupError message={popupError.message}/>
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
									card={card}
									displayCard={displayCard}
									setCardPosition={setCardPosition}
									settings={settings}
									displaySettingsMenu={displaySettingsMenu} />
							</TopGameWrapper>
							<BottomGameWrapper>
								{<PongWrapper social={social}/> }
								{/* <Pong /> */}
								{
									card &&
									<Card
										cardPosition={cardPosition}
										displayCard={displayCard} />
								}
								{
									settings &&
									<SettingsMenu
										displaySettingsMenu={displaySettingsMenu}
										displayTwoFAMenu={displayTwoFAMenu} />
								}
								{
									twoFAMenu &&
									<TwoFaMenu
										displayTwoFAMenu={displayTwoFAMenu} />
								}
								{/* <TestsBack /> */}
								{
									<ContextualMenuContext.Provider value={{ contextualMenu, displayContextualMenu, contextualMenuPosition, setContextualMenuPosition, secondaryContextualMenuHeight, setSecondaryContextualMenuHeight }}>
										<CardContext.Provider value={{ card, displayCard, cardPosition, setCardPosition }}>
											<ChatContext.Provider value={{ chat, displayChat, channelListScrollValue, setChannelListScrollValue, chatScrollValue, setChatScrollValue, chatRender, setChatRender }}>
												<Chat
													chat={chat}
													displayChat={displayChat}
													channels={userAuthenticate.channels}
													chatWindowState={chatWindowState}
													setChatWindowState={setChatWindowState} />
											</ChatContext.Provider>
										</CardContext.Provider>
									</ContextualMenuContext.Provider>
								}
							</BottomGameWrapper>
						</RightGameWrapper>
					</GameWrapper>
				</DisplayContext.Provider>
			</InteractionContext.Provider>
		</GamePage>
	)
}

export default Game