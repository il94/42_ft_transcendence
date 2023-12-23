import {
	useContext,
	useEffect,
	useRef,
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
import SettingsMenu from '../../components/SettingsMenu'
import ContextualMenu from '../../components/ContextualMenus/ContextualMenu'
import SecondaryContextualMenu from '../../components/ContextualMenus/SecondaryContextualMenu'

import CardContext from '../../contexts/CardContext'
import ChatContext from '../../contexts/ChatContext'
import ContextualMenuContext from '../../contexts/ContextualMenuContext'
import GlobalDisplayContext from '../../contexts/GlobalDisplayContext'

import { ChannelData, User, UserAuthenticate } from '../../utils/types'
import { channelStatus, chatWindowStatus, userStatus } from '../../utils/status'

import breakpoints from '../../utils/breakpoints'

import DefaultChannelPicture from "../../assets/default_channel.png"
import TontonPicture from "../../assets/xavier_niel.webp"
import GlobalContext from '../../contexts/GlobalContext'
import axios from 'axios'
import ErrorRequest from '../../componentsLibrary/ErrorRequest'
import ErrorContextualMenu from '../../components/ContextualMenus/ErrorContextualMenu'
import AuthContext from '../../contexts/AuthContext'

function Game() {

	function getSecondaryContextualMenuHeight(numberOfChannels: number) {
		const maxHeight = window.innerHeight * 95 / 100 // taille max possible (height de la fenetre de jeu)

		if (numberOfChannels * 35 < maxHeight) // verifie si la taille max n'est pas depassee
			setSecondaryContextualMenuHeight(numberOfChannels * 35) // 35 = height d'une section
		else
			setSecondaryContextualMenuHeight(maxHeight) // height max
	}

	function closeContextualMenus() {
		displayContextualMenu({ display: false, type: '' })
		displaySecondaryContextualMenu(false)
	}

	const [errorRequest, setErrorRequest] = useState<boolean>(false)

	const [userTarget, setUserTarget] = useState<User | UserAuthenticate>({
		id: 0,
		username: '',
		avatar: '',
		status: userStatus.ONLINE,
		scoreResume: {
			wins: 0,
			draws: 0,
			looses: 0
		}
	})

	const [userAuthenticate, setUserAuthenticate] = useState<UserAuthenticate>({
		id: -1,
		username: "",
		avatar: "",
		status: userStatus.ONLINE,
		scoreResume: {
			wins: 0,
			draws: 0,
			looses: 0
		},
		email: "",
		tel: "",
		twoFA: false,
		friends: [],
		blockedUsers: [],
		channels: []
	})

	const osef = {
		id: 0,
		username: "Osef",
		avatar: '',
		status: userStatus.ONLINE,
		scoreResume: {
			wins: 0,
			draws: 0,
			looses: 0
		}
	}

	const [channelTarget, setChannelTarget] = useState<ChannelData | undefined>(undefined)

	const { token } = useContext(AuthContext)!

	useEffect(() => {
		async function fetchUserAuthenticate() {
			try {
				const response = await axios.get("http://localhost:3333/user/me", {
					headers: {
						'Authorization': `Bearer ${token}`
					}
				})

				setUserAuthenticate({
					id: response.data.id,
					username: response.data.username,
					avatar: response.data.avatar,
					status: userStatus.ONLINE,
					scoreResume: { // a recuperer depuis la reponse
						wins: 100,
						draws: 1,
						looses: 0
					},
					email:response.data.email,
					tel: response.data.tel,
					twoFA: false, // a recuperer depuis la reponse
					friends: [], // a recuperer depuis la reponse
					blockedUsers: [], // a recuperer depuis la reponse
					channels: [] // a recuperer depuis la reponse
				})
				/* ============================================== */
			}
			catch (error) {
				localStorage.removeItem('token')
				setErrorRequest(true)
			}
		}
		fetchUserAuthenticate()
	}, [])

	useEffect(() => {
		async function fetchFriends() {

			// function getStatus(status: string)
			// {
			// 	if (status === "ONLINE")
			// 		return (userStatus.ONLINE)
			// 	else if (status === "OFFLINE")
			// 		return (userStatus.OFFLINE)
			// 	else if (status === "PLAYING")
			// 		return (userStatus.PLAYING)
			// 	else if (status === "WAITING")
			// 		return (userStatus.WAITING)
			// 	else if (status === "WATCHING")
			// 		return (userStatus.WATCHING)
			// }

			/* ============ Temporaire ============== */

			function getRandomStatus() {
				const status = [
					userStatus.ONLINE,
					userStatus.OFFLINE,
					userStatus.PLAYING,
					userStatus.WAITING,
					userStatus.WATCHING
				]

				/* ====================================== */

				const randomStatus = Math.floor(Math.random() * 5)

				return (status[randomStatus])
			}

			try {
				/* ============ Temporaire ============== */
				// const response = await axios.get("http://localhost:3333/user/me/friends")

				const response = await axios.get("http://localhost:3333/user")

				/* ============ Temporaire ============== */

				// En attendant d'avoir le scoreResume retourne par le back
				const tempResponse: User[] = response.data.map((friend: User) => ({
					...friend,
					status: getRandomStatus(),
					// status: getStatus(friend.status),
					scoreResume: {
						wins: 0,
						draws: 0,
						looses: 0
					}
				}))

				// userAuthenticate.friends = tempResponse
				userAuthenticate.friends = tempResponse.splice(0, 10)

				/* ====================================== */

			}
			catch {
				userAuthenticate.friends = []
			}
		}
		fetchFriends()
	}, [userAuthenticate])

	useEffect(() => {
		async function fetchChannels() {
			try {

				/* ============ Temporaire ============== */

				// const response = await axios.get("http://localhost:3333/user/me/channels")
				// setChannels(response.data)

				const tempResponse = [
					{
						id: 0,
						name: "Owner / A",
						avatar: DefaultChannelPicture,
						type: channelStatus.PUBLIC,
						owner: userAuthenticate,
						administrators: [
							userAuthenticate,
							userTarget
						],
						users: [
							userAuthenticate,
							userTarget
						],
						validUsers: [
							userAuthenticate
						],
						mutedUsers: [],
						bannedUsers: []
					},
					{
						id: 0,
						name: "Owner / M",
						avatar: DefaultChannelPicture,
						type: channelStatus.PUBLIC,
						owner: userAuthenticate,
						administrators: [
							userAuthenticate
						],
						users: [
							userAuthenticate,
							userTarget
						],
						validUsers: [
							userAuthenticate
						],
						mutedUsers: [],
						bannedUsers: []
					},
					{
						id: 0,
						name: "Admin / M",
						avatar: DefaultChannelPicture,
						type: channelStatus.PUBLIC,
						owner: osef,
						administrators: [
							userAuthenticate
						],
						users: [
							userAuthenticate,
							userTarget
						],
						validUsers: [
							osef
						],
						mutedUsers: [],
						bannedUsers: []
					},
					{
						id: 0,
						name: "Member / M",
						avatar: DefaultChannelPicture,
						type: channelStatus.PUBLIC,
						owner: osef,
						administrators: [
							osef
						],
						users: [
							userAuthenticate,
							userTarget
						],
						validUsers: [
							osef
						],
						mutedUsers: [],
						bannedUsers: []
					},
					{
						id: 0,
						name: "Admin / O",
						avatar: DefaultChannelPicture,
						type: channelStatus.PUBLIC,
						owner: userTarget,
						administrators: [
							userAuthenticate
						],
						users: [
							userAuthenticate,
							userTarget
						],
						validUsers: [
							userTarget
						],
						mutedUsers: [],
						bannedUsers: []
					},
					{
						id: 0,
						name: "Admin / A",
						avatar: DefaultChannelPicture,
						type: channelStatus.PUBLIC,
						owner: osef,
						administrators: [
							userAuthenticate,
							userTarget
						],
						users: [
							userAuthenticate,
							userTarget
						],
						validUsers: [
							osef
						],
						mutedUsers: [],
						bannedUsers: []
					},
					{
						id: 0,
						name: "Member / O",
						avatar: DefaultChannelPicture,
						type: channelStatus.PUBLIC,
						owner: userTarget,
						administrators: [
							userTarget
						],
						users: [
							userAuthenticate,
							userTarget
						],
						validUsers: [
							userTarget
						],
						mutedUsers: [],
						bannedUsers: []
					},
					{
						id: 0,
						name: "Member / A",
						avatar: DefaultChannelPicture,
						type: channelStatus.PUBLIC,
						owner: osef,
						administrators: [
							userTarget
						],
						users: [
							userAuthenticate,
							userTarget
						],
						validUsers: [
							osef
						],
						mutedUsers: [],
						bannedUsers: []
					},
					{
						id: 0,
						name: "Member / M",
						avatar: DefaultChannelPicture,
						type: channelStatus.PUBLIC,
						owner: osef,
						administrators: [
							osef
						],
						users: [
							userAuthenticate,
							userTarget
						],
						validUsers: [
							osef
						],
						mutedUsers: [],
						bannedUsers: []
					},
					{
						id: 4,
						name: "Private",
						avatar: DefaultChannelPicture,
						type: channelStatus.PRIVATE,
						owner: userAuthenticate,
						administrators: [
							userAuthenticate
						],
						users: [
							userAuthenticate,
							userTarget
						],
						validUsers: [
							userAuthenticate
						],
						mutedUsers: [],
						bannedUsers: []
					},
					{
						id: 5,
						name: "MP",
						avatar: TontonPicture,
						type: channelStatus.PRIVATE,
						owner: userTarget,
						administrators: [
							userTarget
						],
						users: [
							userTarget,
							userAuthenticate
						],
						validUsers: [
							userTarget
						],
						mutedUsers: [],
						bannedUsers: []
					}
				]

				userAuthenticate.channels = tempResponse
				getSecondaryContextualMenuHeight(tempResponse.length)

				/* ====================================== */

			}
			catch (error) {
				userAuthenticate.channels = []
			}
		}
		fetchChannels()
	}, [userAuthenticate])

	const isSmallDesktop = useMediaQuery({ query: breakpoints.smallDesktop })

	const [social, displaySocial] = useState<boolean>(true)

	const [chat, displayChat] = useState<boolean>(false)
	const [channelListScrollValue, setChannelListScrollValue] = useState<number>(0)
	const [chatScrollValue, setChatScrollValue] = useState<number>(0)
	const [chatRender, setChatRender] = useState<boolean>(false)
	const [chatWindowState, setChatWindowState] = useState<chatWindowStatus>(chatWindowStatus.HOME)

	const [card, displayCard] = useState<boolean>(false)
	const [cardPosition, setCardPosition] = useState<{ left?: number; right?: number; top?: number; bottom?: number }>({ left: 0, right: 0, top: 0, bottom: 0 })

	const [contextualMenu, displayContextualMenu] = useState<{ display: boolean; type: string }>({ display: false, type: '' })
	const [contextualMenuPosition, setContextualMenuPosition] = useState<{ left?: number; right?: number; top?: number; bottom?: number }>({ left: 0, right: 0, top: 0, bottom: 0 })
	const [secondaryContextualMenu, displaySecondaryContextualMenu] = useState<boolean>(false)
	const [secondaryContextualMenuPosition, setSecondaryContextualMenuPosition] = useState<{ left?: number; right?: number; top?: number; bottom?: number }>({ left: 0, right: 0, top: 0, bottom: 0 })
	const [secondaryContextualMenuHeight, setSecondaryContextualMenuHeight] = useState<number>(0)
	const [errorContextualMenu, displayErrorContextualMenu] = useState<boolean>(false)

	const [zCardIndex, setZCardIndex] = useState<number>(0)
	const [zChatIndex, setZChatIndex] = useState<number>(0)
	const GameWrapperRef = useRef(null)

	const [settings, displaySettingsMenu] = useState<boolean>(false)

	useEffect(() => {
		displaySocial(isSmallDesktop)
		if (!social)
			displayCard(false)
	}, [isSmallDesktop])

	useEffect(() => {
		if (zCardIndex > 0 && zChatIndex > 0) {
			setZCardIndex(zCardIndex - 1)
			setZChatIndex(zChatIndex - 1)
		}
	}, [zCardIndex, zChatIndex])


	return (
		<GamePage onClick={closeContextualMenus}>
			{
				!errorRequest ?
					<GlobalContext.Provider value={{ userAuthenticate, userTarget, setUserTarget, channelTarget, setChannelTarget }}>
						<GlobalDisplayContext.Provider value={{ zCardIndex, setZCardIndex, zChatIndex, setZChatIndex, GameWrapperRef }}>
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
										displayErrorContextualMenu={displayErrorContextualMenu} />
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
										errorContextualMenuPosition={contextualMenuPosition}
									/>
								}
								<LeftGameWrapper $social={social}>
									<Logo />
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
										<Info
											setChatWindowState={setChatWindowState}
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
										<TestsBack />
										{
											<ContextualMenuContext.Provider value={{ contextualMenu, displayContextualMenu, contextualMenuPosition, setContextualMenuPosition, secondaryContextualMenuHeight, setSecondaryContextualMenuHeight }}>
												<CardContext.Provider value={{ card, displayCard, cardPosition, setCardPosition }}>
													<ChatContext.Provider value={{ chat, displayChat, channelListScrollValue, setChannelListScrollValue, chatScrollValue, setChatScrollValue, chatRender, setChatRender }}>
														<Chat
															channels={userAuthenticate.channels}
															chatWindowState={chatWindowState}
															setChatWindowState={setChatWindowState} />
													</ChatContext.Provider>
												</CardContext.Provider>
											</ContextualMenuContext.Provider>
										}
										{
											settings &&
											<SettingsMenu
												userAuthenticate={userAuthenticate}
												displaySettingsMenu={displaySettingsMenu}
											/>
										}
									</BottomGameWrapper>
								</RightGameWrapper>
							</GameWrapper>
						</GlobalDisplayContext.Provider>
					</GlobalContext.Provider>
					:
					<ErrorRequest />
			}
		</GamePage>
	)
}

export default Game