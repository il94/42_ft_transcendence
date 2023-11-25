import { useContext } from "react"

import { Style, ChatButton } from "./style"

import Icon from "../../componentsLibrary/Icon"
import RoomList from "./RoomList"
import ChatWindow from "./ChatWindow"

import ChatContext from "../../contexts/ChatContext"
import ZIndexContext from "../../contexts/ZIndexContext"

import ChatIcon from "../../assets/chat.png"

function Chat() {

	const { chat, displayChat } = useContext(ChatContext)!
	const { zChatIndex, zCardIndex, setZChatIndex } = useContext(ZIndexContext)!

	function handleCickChatButton() {
		displayChat(true)
		setZChatIndex(zChatIndex + 1)
	}

	return (
		chat ?
		<Style onClick={() => {setZChatIndex(zCardIndex + 1)}} $zIndex={zChatIndex}>
			<RoomList />
			<ChatWindow />
		</Style>
		:
		<ChatButton $zIndex={zChatIndex + 1}>
			<Icon src={ChatIcon} size="38px" onClick={handleCickChatButton}
				 alt="Chat button" title="Chat" />
		</ChatButton>
	)
}

export default Chat