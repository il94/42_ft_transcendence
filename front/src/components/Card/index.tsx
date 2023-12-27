import {
	Dispatch,
	SetStateAction,
	useContext,
	useEffect
} from "react"

import {
	CloseButton,
	Avatar,
	Style,
	TopWrapper,
	UserName
} from "./style"

import MatchHistory from "./MatchHistory"
import ScoreResume from "./ScoreResume"
import Icon from "../../componentsLibrary/Icon"

import DisplayContext from "../../contexts/DisplayContext"

import { User, UserAuthenticate } from "../../utils/types"

import CloseIcon from "../../assets/close.png"

type PropsCard = {
	cardPosition: {
		left?: number,
		right?: number
		top?: number,
		bottom?: number
	},
	displayCard: Dispatch<SetStateAction<boolean>>,
	userTarget: User | UserAuthenticate
}

function Card({ cardPosition, displayCard, userTarget }: PropsCard) {

	const { zChatIndex, zCardIndex, setZCardIndex } = useContext(DisplayContext)!

	useEffect(() => {
		setZCardIndex(zChatIndex + 1)
	}, [])

	return (
		<Style
			onClick={() => { setZCardIndex(zChatIndex + 1) }}
			$left={cardPosition.left}
			$right={cardPosition.right}
			$top={cardPosition.top}
			$bottom={cardPosition.bottom}
			$zIndex={zCardIndex}>
			<TopWrapper>
				<Avatar src={userTarget.avatar} />
				<CloseButton>
					<Icon onClick={() => displayCard(false)}
						src={CloseIcon} size={24}
						alt="Close button" title="Close" />
				</CloseButton>
			</TopWrapper>
			<UserName>
				{userTarget.username}
			</UserName>
			<ScoreResume scoreResume={userTarget.scoreResume} />
			<MatchHistory userTarget={userTarget} />
		</Style>
	)
}

export default Card