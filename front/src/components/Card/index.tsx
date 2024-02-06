import {
	Dispatch,
	SetStateAction,
	useContext,
	useEffect
} from "react"

import {
	Avatar,
	Style,
	UserName
} from "./style"

import MatchHistory from "./MatchHistory"
import ScoreResume from "./ScoreResume"
import CloseButton from "../../componentsLibrary/CloseButton"

import DisplayContext from "../../contexts/DisplayContext"
import InteractionContext from "../../contexts/InteractionContext"

type PropsCard = {
	cardPosition: {
		left?: number,
		right?: number
		top?: number,
		bottom?: number
	},
	displayCard: Dispatch<SetStateAction<boolean>>
}

function Card({ cardPosition, displayCard }: PropsCard) {

	const { userTarget } = useContext(InteractionContext)!
	const { zCardIndex, setZCardIndex, zMaxIndex } = useContext(DisplayContext)!

	useEffect(() => {
		setZCardIndex(zMaxIndex + 1)
	}, [])

	return (
		<Style
			onClick={() => { setZCardIndex(zMaxIndex + 1) }}
			$left={cardPosition.left}
			$right={cardPosition.right}
			$top={cardPosition.top}
			$bottom={cardPosition.bottom}
			$zIndex={zCardIndex}>
			<CloseButton closeFunction={displayCard} />
			<Avatar src={userTarget.avatar} />
			<UserName>
				{userTarget.username}
			</UserName>
			<ScoreResume
				wins={userTarget.wins}
				draws={userTarget.draws}
				losses={userTarget.losses} />
			<MatchHistory />
		</Style>
	)
}

export default Card