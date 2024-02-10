import {
	useContext,
	useEffect,
	useState
} from "react"

import {
	Avatar,
	Style,
	UserName,
	Text,
	MessageContent,
	MaskedMessage
} from "./style"

import {
	showCard,
	showContextualMenu
} from "../functions"

import ContextualMenuContext from "../../../../../contexts/ContextualMenuContext"
import CardContext from "../../../../../contexts/CardContext"
import DisplayContext from "../../../../../contexts/DisplayContext"
import InteractionContext from "../../../../../contexts/InteractionContext"
import AuthContext from "../../../../../contexts/AuthContext"

import {
	userIsBlocked
} from "../../../../../utils/functions"

import {
	User
} from "../../../../../utils/types"

type PropsContactText = {
	sender: User,
	content: string
}

function ContactText({ sender, content }: PropsContactText) {

	const { token, url } = useContext(AuthContext)!
	const { displayContextualMenu, setContextualMenuPosition } = useContext(ContextualMenuContext)!
	const { displayCard, setCardPosition } = useContext(CardContext)!
	const { setZCardIndex, zMaxIndex, displayPopupError, GameWrapperRef } = useContext(DisplayContext)!
	const { userTarget, setUserTarget, userAuthenticate, channelTarget } = useContext(InteractionContext)!

	/* =========================== BLOCK MESSAGES =============================== */

	const [showMessage, setShowMessage] = useState(true)
	const senderIsBlocked = userIsBlocked(userAuthenticate, sender.id)

	function handleClickEvent() {
		if (senderIsBlocked)
			setShowMessage(!showMessage)
	}

	useEffect(() => {
		setShowMessage(!senderIsBlocked)
	}, [senderIsBlocked])

	/* ========================================================================== */

	return (
		<Style $masked={senderIsBlocked}>
			{
				showMessage ?
					<>
						<Avatar
							src={sender.avatar}
							onClick={(event) => showCard(event, sender, {
								displayCard,
								setZCardIndex,
								setCardPosition,
								setUserTarget,
								url,
								token,
								displayPopupError,
								zMaxIndex,
								GameWrapperRef
							})}
							onAuxClick={(event) => showContextualMenu(event, sender, {
								setContextualMenuPosition,
								displayContextualMenu,
								displayCard,
								userAuthenticate,
								userTarget,
								setUserTarget,
								channelTarget,
								url,
								token,
								displayPopupError,
								GameWrapperRef
							})}
							tabIndex={0} />
						<MessageContent
							onClick={handleClickEvent}>
							<UserName>
								{sender.username}
							</UserName>
							<Text $masked={senderIsBlocked}>
								{content}
							</Text>
						</MessageContent>
					</>
					:
					<MaskedMessage onClick={handleClickEvent}>
						Masked message
					</MaskedMessage>
			}
		</Style>
	)
}

export default ContactText