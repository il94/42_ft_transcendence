import {
	Dispatch,
	SetStateAction,
	useContext,
	useEffect,
	useState
} from "react"

import {
	Avatar,
	Rank,
	Style,
	UserName
} from "./style"

import {
	capitalize
} from "../../utils/functions"

import MatchHistory from "./MatchHistory"
import ScoreResume from "./ScoreResume"
import CloseButton from "../../componentsLibrary/CloseButton"

import DisplayContext from "../../contexts/DisplayContext"
import InteractionContext from "../../contexts/InteractionContext"

import {
	ranks
} from "../../utils/status"
import AuthContext from "../../contexts/AuthContext"

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

	const { url } = useContext(AuthContext)!
	const { userTarget } = useContext(InteractionContext)!
	const { zCardIndex, setZCardIndex, zMaxIndex } = useContext(DisplayContext)!

	useEffect(() => {
		setZCardIndex(zMaxIndex + 1)
	}, [])

	const [userRank, setUserRank] = useState<ranks>(ranks.NORANK)

	useEffect(() => {
		const wins: number = userTarget.wins

		if (wins === 0)
			setUserRank(ranks.NORANK)
		else if (wins > 0 && wins <= 5)
			setUserRank(ranks.BRONZE)
		else if (wins > 5 && wins <= 15)
			setUserRank(ranks.SILVER)
		else if (wins > 15 && wins <= 30)
			setUserRank(ranks.GOLD)

	}, [userTarget])

	return (
		<Style
			onClick={() => { setZCardIndex(zMaxIndex + 1) }}
			$left={cardPosition.left}
			$right={cardPosition.right}
			$top={cardPosition.top}
			$bottom={cardPosition.bottom}
			$zIndex={zCardIndex}>
			<CloseButton closeFunction={displayCard} />
			{
				userTarget.avatar &&
				<Avatar
					src={userTarget.avatar}
					$borderColor={userRank} />
			}
			<UserName>
				{userTarget.username}
			</UserName>
			<Rank $color={userRank}>
				{capitalize(userRank)}
			</Rank>
			<ScoreResume
				wins={userTarget.wins}
				draws={userTarget.draws}
				losses={userTarget.losses} />
			<MatchHistory />
		</Style>
	)
}

export default Card