import { useContext, useEffect, useState } from "react"

import { Style, ChatButton } from "./style"

import Icon from "../../componentsLibrary/Icon"
import ChannelList from "./ChannelList"
import ChatWindow from "./ChatWindow"

import ChatContext from "../../contexts/ChatContext"
import ContextualMenuContext from "../../contexts/ContextualMenuContext"
import GlobalDisplayContext from "../../contexts/GlobalDisplayContext"

import { Channel } from "../../utils/types"

import ChatIcon from "../../assets/chat.png"
import DefaultChannelPicture from "../../assets/default_channel.png"

function Chat() {

	const { chat, displayChat } = useContext(ChatContext)!
	const { setSecondaryContextualMenuHeight } = useContext(ContextualMenuContext)!
	const { zChatIndex, zCardIndex, setZChatIndex } = useContext(GlobalDisplayContext)!

	const [createChannelMenu, displayCreateChannelMenu] = useState<boolean>(false)

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
			id: 1,
			name: "Public 1",
			avatar: DefaultChannelPicture,
			type: "public"
		},
		{
			id: 2,
			name: "Public 2",
			avatar: DefaultChannelPicture,
			type: "public"
		},
		{
			id: 3,
			name: "Public 3",
			avatar: DefaultChannelPicture,
			type: "public"
		},
		{
			id: 4,
			name: "Public 4",
			avatar: DefaultChannelPicture,
			type: "public"
		},
		{
			id: 5,
			name: "Protected 1",
			avatar: DefaultChannelPicture,
			type: "protected"
		},
		{
			id: 6,
			name: "Protected 2",
			avatar: DefaultChannelPicture,
			type: "protected"
		},
		{
			id: 7,
			name: "Protected 3",
			avatar: DefaultChannelPicture,
			type: "protected"
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
				createChannelMenu={createChannelMenu}
				displayCreateChannelMenu={displayCreateChannelMenu} />
			<ChatWindow
				channelToDisplay={channels[0]} 
				createChannelMenu={createChannelMenu}
				displayCreateChannelMenu={displayCreateChannelMenu} />
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