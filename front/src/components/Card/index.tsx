import { useContext } from "react"
import { ProfilePicture, Style, UserName } from "./style"
import MatchHistory from "./MatchHistory"
import ScoreResume from "./ScoreResume"
import ZIndexContext from "../../contexts/ZIndexContext"


function Card({ cardPosition } : { cardPosition: { top: number, left: number} }) {

	const { zChatIndex, setZCardIndex } = useContext(ZIndexContext)!

	return (
		<Style onClick={() => {setZCardIndex(zChatIndex - 1)}}
				$top={cardPosition.top} $left={cardPosition.left} $zIndex={zChatIndex - 1}>
			<ProfilePicture />
			<UserName>
				WWWWWWWW
			</UserName>
			<ScoreResume />
			<MatchHistory />
		</Style>
	)
}

export default Card