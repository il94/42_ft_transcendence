import { ProfilePicture, Style, UserName } from "./style"
import MatchHistory from "./MatchHistory"
import Score from "./Score"

function Card({ cardPosition } : { cardPosition: { top: number, left: number} }) {

	return (
		<Style $top={cardPosition.top} $left={cardPosition.left}>
			<ProfilePicture />
			<UserName>
				Example
			</UserName>
			<Score />
			<MatchHistory />
		</Style>
	)
}

export default Card