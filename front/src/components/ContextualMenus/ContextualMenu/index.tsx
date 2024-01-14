import {
	Dispatch,
	MouseEvent,
	SetStateAction,
	useContext,
	useEffect,
	useState
} from "react"
import axios from "axios"

import { Style } from "./style"

import Section, { SectionName } from "../../../componentsLibrary/Section"
import ErrorRequest from "../../../componentsLibrary/ErrorRequest"

import InteractionContext from "../../../contexts/InteractionContext"
import AuthContext from "../../../contexts/AuthContext"

import {
	Channel,
	MessageInvitation,
	User,
	UserAuthenticate
} from "../../../utils/types"

import {
	challengeStatus,
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

	const { token } = useContext(AuthContext)!

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
	
		if (channelTarget && type === contextualMenuStatus.CHAT &&
			(channelTarget.owner === userAuthenticate ||
				(channelTarget.administrators.includes(userAuthenticate) &&
				!channelTarget.administrators.includes(userTarget)) &&
				(channelTarget.owner !== userTarget &&
					!channelTarget.administrators.includes(userTarget)))) {
			displayAdminSections(true)
		}
		else
			displayAdminSections(false)
	}, [])

	const { userAuthenticate, setUserAuthenticate, channelTarget, setChannelTarget } = useContext(InteractionContext)!

	async function handleContactClickEvent() {
		try {
			const findResult = userAuthenticate.channels.find((channel) => (
				channel.name === userTarget.username && channel.type === channelStatus.MP
			))
			if (findResult)
				setChannelTarget(findResult)
			else
			{
				const newChannel: Channel = {
					id: -1, //???
					name: userTarget.username,
					avatar: userTarget.avatar,
					type: channelStatus.MP,
					messages: [],
					owner: userAuthenticate,
					administrators: [],
					users: [
						userAuthenticate,
						userTarget
					],
					mutedUsers: [],
					bannedUsers: []
				}

				/* ============ Temporaire ============== */

				// Verifier si le channel mp n'existe pas deja
				// await axios.post(`http://localhost:3333/channel`, {
				// 	name: userTarget.id,
				// 	avatar: userTarget.avatar,
				// 	type: channelStatus.MP
				// })

				/* ====================================== */

				userAuthenticate.channels.push(newChannel)
				setChannelTarget(newChannel)
			}
			displayChat(true)
		}
		catch (error) {
			displayErrorContextualMenu(true)
		}
	}

	async function handleChallengeClickEvent() {
		try {

			const challengeInvitation: MessageInvitation = {
				id: -1, //???
				sender: userAuthenticate,
				type: messageStatus.INVITATION,
				target: userTarget,
				status: challengeStatus.PENDING
			}

			/* ============ Temporaire ============== */

			// Verifier si une invitation n'existe pas deja
			// await axios.post(`http://localhost:3333/user/me/challenge/${userTarget.id}`, {
			// 	type: challengeStatus.PENDING
			// })

			/* ====================================== */

			if (type === contextualMenuStatus.SOCIAL)
			{
				const findResult = userAuthenticate.channels.find((channel) => (
					channel.name === userTarget.username && channel.type === channelStatus.MP
				))
				if (findResult)
				{
					findResult.messages.push(challengeInvitation)
					setChannelTarget(findResult)
				}
				else
				{
					const newChannel: Channel = {
						id: -1, //???
						name: userTarget.username,
						avatar: userTarget.avatar,
						type: channelStatus.MP,
						messages: [],
						owner: userAuthenticate,
						administrators: [],
						users: [
							userAuthenticate,
							userTarget
						],
						mutedUsers: [],
						bannedUsers: []
					}

					/* ============ Temporaire ============== */

					// Verifier si le channel mp n'existe pas deja
					// await axios.post(`http://localhost:3333/channel`, {
					// 	name: userTarget.id,
					// 	avatar: userTarget.avatar,
					// 	type: channelStatus.MP
					// })

					/* ====================================== */

					newChannel.messages.push(challengeInvitation)
					userAuthenticate.channels.push(newChannel)
					setChannelTarget(newChannel)
				}
				displayChat(true)
			}
			else
			{
				if (channelTarget)
					channelTarget.messages.push(challengeInvitation)
				else
					throw new Error
			}
		}
		catch (error) {
			displayErrorContextualMenu(true)
		}
	}

	async function handleManageFriendClickEvent() {
		try {
			if (!userAuthenticate.friends.some((friend) => friend.id === userTarget.id)) {
				await axios.post(`http://localhost:3333/friends/${user.id}`, {}, {
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
				await axios.delete(`http://localhost:3333/friends/${userTarget.id}`, {
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
				await axios.post(`http://localhost:3333/blockeds/${userTarget.id}`, {}, {
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

				console.log("DELETE")
				await axios.delete(`http://localhost:3333/blockeds/${userTarget.id}`, {
					headers: {
						'Authorization': `Bearer ${token}`
					}
				})

				setUserAuthenticate((prevState: UserAuthenticate) => {

					const { blockedUsers, ...rest } = prevState

					console.log("REST", rest)

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
			if (!channelTarget.administrators.includes(userTarget)) {
				/* ============ Temporaire ============== */

				// await axios.post(`http://localhost:3333/channel/${channelTarget.id}/administrators/${userTarget.id}`)

				/* ====================================== */

				channelTarget.administrators.push(userTarget)
			}
			else {
				/* ============ Temporaire ============== */

				// await axios.delete(`http://localhost:3333/channel/${channelTarget.id}/administrators/${userTarget.id}`)

				/* ====================================== */

				channelTarget.administrators.splice(channelTarget.administrators.indexOf(userTarget), 1)
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

				// await axios.post(`http://localhost:3333/channel/${channelTarget.id}/mutedusers/${userTarget.id}`)

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
			if (!channelTarget.users.includes(userTarget)) {
				/* ============ Temporaire ============== */

				// await axios.delete(`http://localhost:3333/channel/${channelTarget.id}/users/${userTarget.id}`)

				/* ====================================== */

				channelTarget.users.splice(channelTarget.users.indexOf(userTarget), 1)
			}
		}
		catch (error) {
			displayErrorContextualMenu(true)
		}
	}

	async function handleBanClickEvent() {
		try {
			if (!channelTarget)
				throw new Error
			if (!channelTarget.bannedUsers.includes(userTarget)) {
				/* ============ Temporaire ============== */

				// await axios.post(`http://localhost:3333/channel/${channelTarget.id}/bannedusers/${userTarget.id}`)

				/* ====================================== */

				channelTarget.bannedUsers.push(userTarget)
				handleKickClickEvent()
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
						<Section onMouseEnter={showSecondaryContextualMenu}>
							<SectionName>
								Invite
							</SectionName>
						</Section>
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
							<Section onClick={handleManageFriendClickEvent}>
								<SectionName>
									{
										!userAuthenticate.friends.includes(userTarget) ?
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
															channelTarget.owner === userAuthenticate &&
															<Section onClick={handleGradeClickEvent}>
																<SectionName>
																	{
																		!channelTarget.administrators.includes(userTarget) ?
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