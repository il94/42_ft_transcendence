import {
	useContext,
	useEffect,
	useState
} from "react"

import {
	Message,
	Style
} from "./style"

import {
	showCard,
	showContextualMenu
} from "../functions"

import ActiveText from "../../../../../componentsLibrary/ActiveText/Index"

import AuthContext from "../../../../../contexts/AuthContext"
import ContextualMenuContext from "../../../../../contexts/ContextualMenuContext"
import CardContext from "../../../../../contexts/CardContext"
import DisplayContext from "../../../../../contexts/DisplayContext"
import InteractionContext from "../../../../../contexts/InteractionContext"

import {
	logType
} from "../../../../../utils/status"

import colors from "../../../../../utils/colors"

type PropsLog = {
	type: logType,
	user1?: {
		id: number,
		username: string
	},
	user2?: {
		id: number,
		username: string
	}
}

function Log({ type, user1, user2 }: PropsLog) {
	
	const { token, url } = useContext(AuthContext)!
	const { displayContextualMenu, setContextualMenuPosition } = useContext(ContextualMenuContext)!
	const { displayCard, setCardPosition } = useContext(CardContext)!
	const { setZCardIndex, zMaxIndex, displayPopupError, GameWrapperRef } = useContext(DisplayContext)!
	const { userTarget, setUserTarget, userAuthenticate, channelTarget } = useContext(InteractionContext)!

	const [log, setLog] = useState<string>('')
	
	useEffect(() => {
		if (type === logType.JOIN)
			setLog("joined channel")
		else if (type === logType.INVITE)
			setLog("invited")
		else if (type === logType.LEAVE)
			setLog("leaved channel")
		else if (type === logType.UPGRADE)
			setLog("upgraded")
		else if (type === logType.DOWNGRADE)
			setLog("downgraded")
		else if (type === logType.BAN)
			setLog("banned")
		else if (type === logType.UNBAN)
			setLog("unbanned")
		else if (type === logType.MUTE)
			setLog("muted")
		else if (type === logType.KICK)
			setLog("kicked")
	}, [])

	return (
		<Style>
			<Message>
				{
					user1 &&
					<ActiveText
						onClick={(event) => showCard(event, user1.id, {
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
						onAuxClick={(event) => showContextualMenu(event, user1.id, {
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
						$fontSize={10}
						color={colors.textAlt}>
						{user1.username}&nbsp;
					</ActiveText>
				}
				{ log }
				{
					user2 &&
					<ActiveText
						onClick={(event) => showCard(event, user2.id, {
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
						onAuxClick={(event) => showContextualMenu(event, user2.id, {
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
						$fontSize={10}
						color={colors.textAlt}>
						&nbsp;{user2.username}
					</ActiveText>
				}
			</Message>
		</Style>
			
	)
}

export default Log