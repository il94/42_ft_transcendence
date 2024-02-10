import {
	Dispatch,
	SetStateAction,
	useContext,
	useEffect,
	useState
} from "react"

import {
	Style,
	ChatButton,
	TopChatWrapper,
	BottomChatWrapper,
	ChannelCreateButton,
	Interfaces,
	// Notification,
	// NotificationCount
} from "./style"

import ChannelList from "./ChannelList"
import ChatInterface from "./ChatInterface"
import ChannelInterface from "./ChannelInterface"
import Banner from "./Banner"
import HomeInterface from "./HomeInterface"
import LockedInterface from "./LockedInterface"
import Icon from "../../componentsLibrary/Icon"
import Loader from "../../componentsLibrary/Loader"

import DisplayContext from "../../contexts/DisplayContext"
import InteractionContext from "../../contexts/InteractionContext"

import {
	channelIsProtected,
	userIsInChannel
} from "../../utils/functions"

import {
	Channel,
	ChannelData
} from "../../utils/types"

import {
	chatWindowStatus
} from "../../utils/status"

import ChatIcon from "../../assets/chat.png"

type PropsChat = {
	chat: boolean,
	displayChat: Dispatch<SetStateAction<boolean>>,
	channels: (Channel | ChannelData)[],
	chatWindowState: chatWindowStatus,
	setChatWindowState: Dispatch<SetStateAction<chatWindowStatus>>,
}

function Chat({ chat, displayChat, channels, chatWindowState, setChatWindowState }: PropsChat) {

	const { userAuthenticate, channelTarget } = useContext(InteractionContext)!
	const { zChatIndex, setZChatIndex, zMaxIndex, loaderChat } = useContext(DisplayContext)!   
      
	/* ============================ CHAT STATE ================================== */

	// Au clic sur le bouton create, définit le bon state pour afficher la fenêtre désirée
	function handleClickCreateButton() {

		if (chatWindowState === chatWindowStatus.HOME)
			setChatWindowState(chatWindowStatus.CREATE_CHANNEL)
		else if (chatWindowState === chatWindowStatus.CHANNEL)
			setChatWindowState(chatWindowStatus.CREATE_CHANNEL)
		else if (chatWindowState === chatWindowStatus.LOCKED_CHANNEL)
			setChatWindowState(chatWindowStatus.HOME)
		else if (chatWindowState === chatWindowStatus.UPDATE_CHANNEL)
			setChatWindowState(chatWindowStatus.CHANNEL)
		else if (chatWindowState === chatWindowStatus.CREATE_CHANNEL) {
			if (!channelTarget)
				setChatWindowState(chatWindowStatus.HOME)
			else
				setChatWindowState(chatWindowStatus.CHANNEL)
		}
	}

	// Aux changements de channel, définit le bon state pour afficher la fenêtre désirée
	useEffect(() => {
		if (channelTarget) {
			if (channelIsProtected(channelTarget) &&
				!userIsInChannel(channelTarget, userAuthenticate.id))
				setChatWindowState(chatWindowStatus.LOCKED_CHANNEL)
			else
				setChatWindowState(chatWindowStatus.CHANNEL)
		}
		else
			setChatWindowState(chatWindowStatus.HOME)
	}, [channelTarget])

	/* ============================== DISPLAY =================================== */

	// Ouvre le chat et le place devant les autres fenêtres du site
	function handleCickChatButton() {
		displayChat(true)
		setZChatIndex(zChatIndex + 1)
	}

	const [valueChannelCreateButton, setValueChannelCreateButton] = useState<string>("Create")
	const [bannerName, setBannerName] = useState<string>("Welcome")

	// A l'ouverture du chat, le place devant les autres fenêtres du site
	useEffect(() => {
		setZChatIndex(zMaxIndex + 1)
	}, [])

	// Aux changements de channel ou d'état, affiche le bon titre pour la bannière et change la valeur du bouton de channel list
	useEffect(() => {
		if (chatWindowState === chatWindowStatus.HOME) {
			setValueChannelCreateButton("Create")
			setBannerName("Welcome")
		}
		else if (channelTarget && chatWindowState === chatWindowStatus.CHANNEL) {
			setValueChannelCreateButton("Create")
			setBannerName(channelTarget.name)
		}
		else if (channelTarget && (chatWindowState === chatWindowStatus.UPDATE_CHANNEL
			|| chatWindowState === chatWindowStatus.LOCKED_CHANNEL)) {
			setValueChannelCreateButton("<<")
			setBannerName(channelTarget.name)
		}
		else if (chatWindowState === chatWindowStatus.CREATE_CHANNEL) {
			setValueChannelCreateButton("<<")
			setBannerName("Create")
		}
		else
			setChatWindowState(chatWindowStatus.HOME)

	}, [chatWindowState, channelTarget])

	/* ========================================================================== */

	return (
		chat ?
			<Style
				onContextMenu={(event) => event.preventDefault()}
				onClick={() => { setZChatIndex(zMaxIndex + 1) }}
				$zIndex={zChatIndex}>
				<TopChatWrapper>
					<ChannelCreateButton onClick={handleClickCreateButton}>
						{valueChannelCreateButton}
					</ChannelCreateButton>
					<Banner
						bannerName={bannerName}
						chatWindowState={chatWindowState}
						setChatWindowState={setChatWindowState} />
				</TopChatWrapper>
				<BottomChatWrapper>
					{
						chatWindowState === chatWindowStatus.UPDATE_CHANNEL ||
							chatWindowState === chatWindowStatus.CREATE_CHANNEL ?
							<ChannelInterface
								setBannerName={setBannerName}
								chatWindowState={chatWindowState}
								setChatWindowState={setChatWindowState} />
							:
							<>
								<ChannelList channels={channels} />
								<Interfaces>
								{
									chatWindowState === chatWindowStatus.HOME ||
										!channelTarget ?
										<HomeInterface />
										: chatWindowState === chatWindowStatus.LOCKED_CHANNEL ?
											<LockedInterface />
											:
											<ChatInterface />
								}
								{
									loaderChat &&
									<Loader size={150}/>
								}
								</Interfaces>
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