import { ProfilePicture, Style, UserName } from "./style"
import MatchHistory from "./MatchHistory"
import ScoreResume from "./ScoreResume"

function Card({ cardPosition } : { cardPosition: { top: number, left: number} }) {

	return (
		<Style $top={cardPosition.top} $left={cardPosition.left}>
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