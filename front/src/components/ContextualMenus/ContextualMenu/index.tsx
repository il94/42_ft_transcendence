import {
	Dispatch,
	MouseEvent,
	SetStateAction,
	useContext,
	useEffect,
	useState
} from "react"
import axios, { AxiosResponse } from "axios"

import { Style } from "./style"

import Section, { SectionName } from "../../../componentsLibrary/Section"
import ErrorRequest from "../../../componentsLibrary/ErrorRequest"

import InteractionContext from "../../../contexts/InteractionContext"
import AuthContext from "../../../contexts/AuthContext"

import { userIsBanned, userIsInChannel } from "../../../utils/functions"

import {
	Channel,
	MessageInvitation,
	User,
	UserAuthenticate
} from "../../../utils/types"

import {
	challengeStatus,
	channelRole,
	channelStatus,
	contextualMenuStatus,
	messageStatus,
	userStatus
} from "../../../utils/status"

type PropsContextualMenu = {
	type: contextualMenuStatus | undefined,
	displayContextualMenu: Dispatch<SetStateAction<{
		display: boolean,
		type: contextualMenuStatus | undefined
	}>>,
	userTarget: User,
	contextualMenuPosition: {
		left?: number,
		right?: number,
		top?: number,
		bottom?: number
	},
	displaySecondaryContextualMenu: Dispatch<SetStateAction<boolean>>,
	setSecondaryContextualMenuPosition: Dispatch<SetStateAction<{
		left?: number,
		right?: number,
		top?: number,
		bottom?: number
	}>>,
	secondaryContextualMenuHeight: number,
	displayErrorContextualMenu: Dispatch<SetStateAction<boolean>>,
	displayChat: Dispatch<SetStateAction<boolean>>
}

function ContextualMenu({ type, contextualMenuPosition, displaySecondaryContextualMenu, userTarget, setSecondaryContextualMenuPosition, secondaryContextualMenuHeight, displayErrorContextualMenu, displayChat }: PropsContextualMenu) {

	const { token, url } = useContext(AuthContext)!

	function showSecondaryContextualMenu(event: MouseEvent<HTMLButtonElement>) {

		const inviteSectionContainer = event.target as HTMLElement

		if (inviteSectionContainer) {
			const horizontalBorder = window.innerHeight * 5 / 100 // height des bordures horizontales autour du jeu
			const maxBottom = window.innerHeight - horizontalBorder - secondaryContextualMenuHeight // valeur max avant que le menu ne depasse par le bas
			const { x: leftMenu, y: topMenu } = inviteSectionContainer.getBoundingClientRect() // position du menu principal

			const offsetX = leftMenu < window.innerWidth ? 180 : -180 // determine de quel cote le menu secondaire doit etre decale par rapport a la position du menu principal
			let offsetY = 0 // decalage vertical par defaut du menu secondaire si il ne depasse pas

			if (topMenu - horizontalBorder / 2 > maxBottom) // verifie si le menu secondaire depasse sur l'axe vertical
				offsetY = maxBottom - (topMenu - horizontalBorder / 2) // ajuste le resultat vertical

			setSecondaryContextualMenuPosition({
				left: contextualMenuPosition.left && contextualMenuPosition.left + offsetX,
				right: contextualMenuPosition.right && contextualMenuPosition.right + offsetX,
				top: contextualMenuPosition.top && contextualMenuPosition.top + offsetY,
				bottom: contextualMenuPosition.bottom && contextualMenuPosition.bottom + offsetY

			})
			displaySecondaryContextualMenu(true)
		}
	}

	const [adminSections, displayAdminSections] = useState<boolean>(false)

	useEffect(() => {
		if (channelTarget &&
			type === contextualMenuStatus.CHAT &&
			(channelTarget.owner?.id === userAuthenticate.id ||
			(channelTarget.administrators.some((administrator) => administrator.id === userAuthenticate.id) &&
				!channelTarget.administrators.some((administrator) => administrator.id === userTarget.id)) &&
			(channelTarget.owner?.id !== userTarget.id &&
				!channelTarget.administrators.some((administrator) => administrator.id === userTarget.id)))) {
			displayAdminSections(true)
		}
		else
			displayAdminSections(false)
	}, [])

	const { userAuthenticate, setUserAuthenticate, channelTarget, setChannelTarget } = useContext(InteractionContext)!

	async function handleContactClickEvent() {
		try {
			const findChannelMP = userAuthenticate.channels.find((channel) => (
				channel.name === userTarget.username && channel.type === channelStatus.MP
			))
			if (findChannelMP)
			{
				setChannelTarget(findChannelMP)
				displayChat(true)
				return (findChannelMP)
			}
			else
			{
				const MPDatas: any = {
					name: '',
					avatar: '',
					type: channelStatus.MP
				}		

				const newChannelMPResponse: AxiosResponse = await axios.post(`http://${url}:3333/channel/mp/${userTarget.id}`, MPDatas,
				{
					headers: {
						'Authorization': `Bearer ${token}`
					}
				})
				console.log("newChannelMPResponse", newChannelMPResponse)

				const newChannelMP = {
					...newChannelMPResponse.data,
					messages: [],
					members: [
						userAuthenticate,
						userTarget
					],
					administrators: [],
					owner: undefined,
					mutedUsers: [],
					banneds: []
				}
				displayChat(true)
				return (newChannelMP)
			}
		}
		catch (error) {
			displayErrorContextualMenu(true)
		}
	}

	async function handleChallengeClickEvent() {
		try {
			console.log(userTarget.id);
			
			/* ============ Temporaire ============== */
			// Verifier si une invitation n'existe pas deja
			/* ====================================== */

			let channel: Channel

			if (type === contextualMenuStatus.SOCIAL)
			{
				const channelMP = await handleContactClickEvent()
				
				channel = channelMP
			}
			else if (channelTarget)
				channel = channelTarget
			else
				throw new Error

			const idMsg = await axios.post(`http://localhost:3333/channel/${channel.id}/invitation`, 
			{ msgStatus : messageStatus.INVITATION, targetId : userTarget.id},
				{
					headers: {
						'Authorization': `Bearer ${token}`
					}
				}
			);
			const sockets = await axios.get(`http://localhost:3333/channel/${channel.id}/sockets`, {
			headers: {
					'Authorization': `Bearer ${token}`
				}
			})
			userAuthenticate.socket?.emit("sendDiscussion", sockets.data, userAuthenticate.id, channel.id, userTarget.id, idMsg.data);													 
		}
		catch (error) {
			console.log(error);
			displayErrorContextualMenu(true)
		}
	} 

	async function handleManageFriendClickEvent() {
		try {
			if (!userAuthenticate.friends.some((friend) => friend.id === userTarget.id)) {
				await axios.post(`http://${url}:3333/friends/${userTarget.id}`, {}, {
					headers: {
						'Authorization': `Bearer ${token}`
					}
				})

				setUserAuthenticate((prevState: UserAuthenticate) => ({
					...prevState,
					friends: [ ...prevState.friends, userTarget]
				}))
			}
			else {
				await axios.delete(`http://${url}:3333/friends/${userTarget.id}`, {
					headers: {
						'Authorization': `Bearer ${token}`
					}
				})

				setUserAuthenticate((prevState: UserAuthenticate) => {

					const { friends, ...rest } = prevState

					return {
						...rest,
						friends: friends.filter((friend) => friend.id !== userTarget.id)
					}
				})
			}
		}
		catch (error) {
			console.log(error)
			displayErrorContextualMenu(true)
		}
	}

	async function handleBlockClickEvent() {
		try {
			if (!userAuthenticate.blockedUsers.some((blockedUser) => blockedUser.id === userTarget.id)) {
				await axios.post(`http://${url}:3333/blockeds/${userTarget.id}`, {}, {
					headers: {
						'Authorization': `Bearer ${token}`
					}
				})

				setUserAuthenticate((prevState: UserAuthenticate) => {
					return {
						...prevState,
						blockedUsers: [ ...prevState.blockedUsers, userTarget ]
					}
				})
			}
			else {
				await axios.delete(`http://${url}:3333/blockeds/${userTarget.id}`, {
					headers: {
						'Authorization': `Bearer ${token}`
					}
				})

				setUserAuthenticate((prevState: UserAuthenticate) => {

					const { blockedUsers, ...rest } = prevState

					return {
						...rest,
						blockedUsers: blockedUsers.filter((blockedUser) => blockedUser.id !== userTarget.id)
					}
				})
			}
		}
		catch (error) {
			displayErrorContextualMenu(true)
		}
	}

	async function handleGradeClickEvent() {
		try {
			if (!channelTarget)
				throw new Error
			if (!channelTarget.administrators.some((administrator) => administrator.id === userTarget.id)) {

				await axios.patch(`http://${url}:3333/channel/${channelTarget.id}/role/${userTarget.id}`, {
					role: channelRole.ADMIN
				},
				{
					headers: {
						'Authorization': `Bearer ${token}`
					}
				})
			}
			else {
				await axios.patch(`http://${url}:3333/channel/${channelTarget.id}/role/${userTarget.id}`, {
					role: channelRole.MEMBER
				},
				{
					headers: {
						'Authorization': `Bearer ${token}`
					}
				})
			}
		}
		catch (error) {
			displayErrorContextualMenu(true)
		}
	}

	async function handleMuteClickEvent() {
		try {
			if (!channelTarget)
				throw new Error
			if (!channelTarget.mutedUsers.includes(userTarget)) {
				/* ============ Temporaire ============== */

				// await axios.post(`http://${url}:3333/channel/${channelTarget.id}/mutedusers/${userTarget.id}`)

				/* ====================================== */

				channelTarget.mutedUsers.push(userTarget)
			}
		}
		catch (error) {
			displayErrorContextualMenu(true)
		}
	}

	async function handleKickClickEvent() {
		try {
			if (!channelTarget)
				throw new Error
			await axios.delete(`http://${url}:3333/channel/${channelTarget.id}/leave/${userTarget.id}`, {
				headers: {
					'Authorization': `Bearer ${token}`
				}
			})
		}
		catch (error) {
			displayErrorContextualMenu(true)
		}
	}

	async function handleBanClickEvent() {
		try {
			if (!channelTarget)
				throw new Error
			if (!channelTarget.banneds.some((banned) => banned.id === userTarget.id)) {

				await axios.patch(`http://${url}:3333/channel/${channelTarget.id}/role/${userTarget.id}`, {
					role: channelRole.BANNED
				},
				{
					headers: {
						'Authorization': `Bearer ${token}`
					}
				})
			}
			else {
				await axios.patch(`http://${url}:3333/channel/${channelTarget.id}/role/${userTarget.id}`, {
					role: channelRole.UNBANNED
				},
				{
					headers: {
						'Authorization': `Bearer ${token}`
					}
				})
			}
		}
		catch (error) {
			displayErrorContextualMenu(true)
		}
	}

	return (
		<Style
			$left={contextualMenuPosition.left}
			$right={contextualMenuPosition.right}
			$top={contextualMenuPosition.top}
			$bottom={contextualMenuPosition.bottom}>
			{
				userTarget ?
					<>
						{
							userAuthenticate.channels.length > 0 &&
							<Section onMouseEnter={showSecondaryContextualMenu}>
								<SectionName>
									Invite
								</SectionName>
							</Section>
						}
						<div onMouseEnter={() => displaySecondaryContextualMenu(false)}>
							<Section onClick={handleContactClickEvent}>
								<SectionName>
									Contact
								</SectionName>
							</Section>
							{
								userTarget.status !== userStatus.OFFLINE &&
								<Section onClick={handleChallengeClickEvent}>
									<SectionName>
										Challenge
									</SectionName>
								</Section>
							}
							{
								userTarget.status === userStatus.PLAYING &&
								<Section onClick={handleContactClickEvent}>
									<SectionName>
										Spectate
									</SectionName>
								</Section>
							}
							<Section onClick={handleManageFriendClickEvent}>
								<SectionName>
									{
										!userAuthenticate.friends.some((friend) => friend.id === userTarget.id) ?
											"Add"
											:
											"Delete"
									}
								</SectionName>
							</Section>
							<Section onClick={handleBlockClickEvent}>
								<SectionName>
									{
										!userAuthenticate.blockedUsers.some((blockedUser) => blockedUser.id === userTarget.id) ?
											"Block"
											:
											"Unblock"
									}
								</SectionName>
							</Section>
							{
								type === contextualMenuStatus.CHAT && channelTarget?.type !== channelStatus.MP &&
								<>
									{
										channelTarget ?
											<>
												{
													adminSections &&
													<>
														{
															userIsInChannel(channelTarget, userTarget.id) &&
															<>
																{
																channelTarget.owner?.id === userAuthenticate.id &&
																	<Section onClick={handleGradeClickEvent}>
																		<SectionName>
																			{
																				!channelTarget.administrators.some((administrator) => administrator.id === userTarget.id) ?
																					"Upgrade"
																					:
																					"Downgrade"
																			}
																		</SectionName>
																	</Section>
																}
																<Section onClick={handleMuteClickEvent}>
																	<SectionName>
																		Mute
																	</SectionName>
																</Section>
																<Section onClick={handleKickClickEvent}>
																	<SectionName>
																		Kick
																	</SectionName>
																</Section>
																<Section onClick={handleBanClickEvent}>
																	<SectionName>
																		Ban
																	</SectionName>
																</Section>
															</>
														}
														{
															userIsBanned(channelTarget, userTarget.id) &&
															<Section onClick={handleBanClickEvent}>
																<SectionName>
																	Unban
																</SectionName>
															</Section>
														}
													</>
												}
											</>
											:
											<ErrorRequest />
									}
								</>
							}
						</div>
					</>
					:
					<ErrorRequest />
			}
		</Style>
	)
}

export default ContextualMenu