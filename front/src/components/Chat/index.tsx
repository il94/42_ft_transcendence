import { useContext, useEffect, useState } from "react"

import { Style, ChatButton } from "./style"

import Icon from "../../componentsLibrary/Icon"
import ChannelList from "./ChannelList"
import ChatWindow from "./ChatWindow"

import ChatContext from "../../contexts/ChatContext"
import ZIndexContext from "../../contexts/ZIndexContext"

import { Channel } from "../../utils/types"

import ChatIcon from "../../assets/chat.png"
import DefaultChannelPicture from "../../assets/default_channel.png"

function Chat() {

	const { chat, displayChat } = useContext(ChatContext)!
	const { zChatIndex, zCardIndex, setZChatIndex } = useContext(ZIndexContext)!

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
			id: 20,
			name: "Public",
			avatar: DefaultChannelPicture,
			type: "public"
		},
		{
			id: 21,
			name: "Protect",
			avatar: DefaultChannelPicture,
			type: "protected"
		},
		{
			id: 22,
			name: "Private",
			avatar: DefaultChannelPicture,
			type: "private"
		}
	]

	/* ============================================== */

	return (
		chat ?
		<Style
			onContextMenu={(event) => event.preventDefault()}
			onClick={() => {setZChatIndex(zCardIndex + 1)}}
			$zIndex={zChatIndex}>
			<ChannelList
				channels={channels}
				displayCreateChannelMenu={displayCreateChannelMenu} />
			<ChatWindow
				channelToDisplay={channels[0]} 
				createChannelMenu={createChannelMenu} />
		</Style>
		:
		<ChatButton $zIndex={zChatIndex + 1}>
			<Icon
				onClick={handleCickChatButton}
				src={ChatIcon} size="38px" 
				alt="Chat button" title="Chat" />
		</ChatButton>
	)
}

export default Chat