import { useContext } from "react"

import { Style, ChatButton } from "./style"

import Icon from "../../componentsLibrary/Icon"
import ChannelList from "./ChannelList"
import ChatWindow from "./ChatWindow"

import ChatContext from "../../contexts/ChatContext"
import ZIndexContext from "../../contexts/ZIndexContext"

import { Channel } from "../../utils/types"

import ChatIcon from "../../assets/chat.png"
import DefaultPicture from "../../assets/default_black.png"

function Chat() {

	const { chat, displayChat } = useContext(ChatContext)!
	const { zChatIndex, zCardIndex, setZChatIndex } = useContext(ZIndexContext)!

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
			picture: DefaultPicture,
			type: "public"
		},
		{
			id: 21,
			name: "Protect",
			picture: DefaultPicture,
			type: "protected"
		},
		{
			id: 22,
			name: "Private",
			picture: DefaultPicture,
			type: "private"
		}
	]

	/* ============================================== */


	return (
		chat ?
		<Style onClick={() => {setZChatIndex(zCardIndex + 1)}} $zIndex={zChatIndex}>
			<ChannelList channels={channels} />
			<ChatWindow toDisplay={channels[0]} />
		</Style>
		:
		<ChatButton $zIndex={zChatIndex + 1}>
			<Icon src={ChatIcon} size="38px" onClick={handleCickChatButton}
				 alt="Chat button" title="Chat" />
		</ChatButton>
	)
}

export default Chat