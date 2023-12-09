import { useContext, useEffect, useState } from "react"

import {
	Style,
	ChatButton,
	TopChatWrapper, 
	BottomChatWrapper,
	ChannelCreateButton
} from "./style"

import ChannelList from "./ChannelList"
import ChatInterface from "./ChatInterface"
import ChannelInterface from "./ChannelInterface"
import Banner from "./Banner"
import Icon from "../../componentsLibrary/Icon"

import ChatContext from "../../contexts/ChatContext"
import ContextualMenuContext from "../../contexts/ContextualMenuContext"
import GlobalDisplayContext from "../../contexts/GlobalDisplayContext"

import { Channel } from "../../utils/types"
import { channelStatus, chatWindowStatus } from "../../utils/status"

import ChatIcon from "../../assets/chat.png"
import DefaultChannelPicture from "../../assets/default_channel.png"
import TontonPicture from "../../assets/xavier_niel.webp"

function Chat() {
	
	function handleCickChatButton() {
		displayChat(true)
		setZChatIndex(zChatIndex + 1)
	}

	function handleClickCreateButton() {
		if (chatWindowState === chatWindowStatus.CHANNEL)
		{
			setChatWindowState(chatWindowStatus.CREATE_CHANNEL)
			setChannelNameOverview("Create")
		}
		else
			setChatWindowState(chatWindowStatus.CHANNEL)
	}

	/* ============ Temporaire ============== */

	// Recup les Channels du User authentifie avec un truc du style
	// axios.get("http://localhost:3333/user&id=?/channels")

	const channels: Channel[] = [
		{
			id: 0,
			name: "Public",
			avatar: DefaultChannelPicture,
			type: channelStatus.PUBLIC
		},
		{
			id: 1,
			name: "Protect",
			avatar: DefaultChannelPicture,
			type: channelStatus.PROTECTED,
			password: "password"
		},
		{
			id: 2,
			name: "Private",
			avatar: DefaultChannelPicture,
			type: channelStatus.PRIVATE
		},
		{
			id: 3,
			name: "MP",
			avatar: TontonPicture,
			type: channelStatus.PRIVATE
		}
	]

	/* ============================================== */

	const { chat, displayChat } = useContext(ChatContext)!
	const { setSecondaryContextualMenuHeight } = useContext(ContextualMenuContext)!
	const { zChatIndex, zCardIndex, setZChatIndex } = useContext(GlobalDisplayContext)!

	const [channelIdTarget, setChannelIdTarget] = useState<number>(0)
	const [channelTarget, setChannelTarget] = useState<Channel | undefined>()
	const [chatWindowState, setChatWindowState] = useState<chatWindowStatus>(chatWindowStatus.CHANNEL)
	
	const [valueChannelCreateButton, setValueChannelCreateButton] = useState<string>("Create")
	const [channelNameOverview, setChannelNameOverview] = useState<string>()

	useEffect(() => {
		const maxHeight = window.innerHeight * 95 / 100 // taille max possible (height de la fenetre de jeu)

		if (channels.length * 35 < maxHeight) // verifie si la taille max n'est pas depassee
			setSecondaryContextualMenuHeight(channels.length * 35) // 35 = height d'une section
		else
			setSecondaryContextualMenuHeight(maxHeight) // height max
	}, [channels])

	useEffect(() => {
		setZChatIndex(zCardIndex + 1)
	}, [])

	useEffect(() => {
		setChannelTarget(channels.find((channel) => channel.id === channelIdTarget))
	}, [channelIdTarget])

	useEffect(() => {
		if (channelTarget)
			setChannelNameOverview(channelTarget.name)
	}, [channelTarget])

	useEffect(() => {
		if (chatWindowState !== chatWindowStatus.CHANNEL)
			setValueChannelCreateButton("<<")
		else
			setValueChannelCreateButton("Create")
	}, [chatWindowState])

	return (
		chat ?
		<Style
			onContextMenu={(event) => event.preventDefault()}
			onClick={() => {setZChatIndex(zCardIndex + 1)}}
			$zIndex={zChatIndex}>
			<TopChatWrapper>
				<ChannelCreateButton onClick={handleClickCreateButton}>
					{valueChannelCreateButton}
				</ChannelCreateButton>
			<Banner
				chatWindowState={chatWindowState}
				setChatWindowState={setChatWindowState}
				channel={channelTarget}
				channelNameOverview={channelNameOverview} />
			</TopChatWrapper>
			<BottomChatWrapper>
			{
				chatWindowState !== chatWindowStatus.CHANNEL ?
				<ChannelInterface
					channel={channelTarget}
					chatWindowState={chatWindowState}
					setChatWindowState={setChatWindowState}
					setChannelNameOverview={setChannelNameOverview} />
				:
				<>
					<ChannelList
						channels={channels}
						setChannelIdTarget={setChannelIdTarget} />
					<ChatInterface
						channel={channelTarget} />
				</>
			}
			</BottomChatWrapper>
		</Style>
		:
		<ChatButton $zIndex={zChatIndex + 1}>
			<Icon
				onClick={handleCickChatButton}
				src={ChatIcon} size={38}
				alt="Chat button" title="Chat" />
		</ChatButton>
	)
}

export default Chat