import { useContext, useEffect, useState } from "react"

import { Style, ChatButton } from "./style"

import ChannelList from "./ChannelList"
import ChatInterface from "./ChatInterface"
import ChannelInterface from "./ChannelInterface"
import Icon from "../../componentsLibrary/Icon"

import ChatContext from "../../contexts/ChatContext"
import ContextualMenuContext from "../../contexts/ContextualMenuContext"
import GlobalDisplayContext from "../../contexts/GlobalDisplayContext"

import { Channel } from "../../utils/types"
import { channelStatus } from "../../utils/status"

import ChatIcon from "../../assets/chat.png"
import DefaultChannelPicture from "../../assets/default_channel.png"
import TontonPicture from "../../assets/xavier_niel.webp"

function Chat() {

	const { chat, displayChat } = useContext(ChatContext)!
	const { setSecondaryContextualMenuHeight } = useContext(ContextualMenuContext)!
	const { zChatIndex, zCardIndex, setZChatIndex } = useContext(GlobalDisplayContext)!

	const [channelIdTarget, setChannelIdTarget] = useState<number>(0)

	const [channelInterface, displayChannelInterface] = useState<{ display: boolean, updateChannel?: boolean }>({ display: false, updateChannel: false })

	useEffect(() => {
		setZChatIndex(zCardIndex + 1)
	}, [])


	function handleCickChatButton() {
		displayChat(true)
		setZChatIndex(zChatIndex + 1)
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

	useEffect(() => {
		const maxHeight = window.innerHeight * 95 / 100 // taille max possible (height de la fenetre de jeu)

		if (channels.length * 35 < maxHeight) // verifie si la taille max n'est pas depassee
			setSecondaryContextualMenuHeight(channels.length * 35) // 35 = height d'une section
		else
			setSecondaryContextualMenuHeight(maxHeight) // height max
	}, [channels])

	return (
		chat ?
		<Style
			onContextMenu={(event) => event.preventDefault()}
			onClick={() => {setZChatIndex(zCardIndex + 1)}}
			$zIndex={zChatIndex}>
			<ChannelList
				channels={channels}
				setChannelIdTarget={setChannelIdTarget}
				channelInterface={channelInterface}
				displayChannelInterface={displayChannelInterface} />
			{
				channelInterface.display ?
				<ChannelInterface
					channel={channels.find((channel) => channel.id === channelIdTarget)}
					updateChannel={channelInterface.updateChannel}
					displayChannelInterface={displayChannelInterface} />
				:
				<ChatInterface
					channel={channels.find((channel) => channel.id === channelIdTarget)}
					displayUpdateChannelInterface={displayChannelInterface} />
			}
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