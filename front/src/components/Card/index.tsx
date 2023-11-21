import { ProfilePicture, Score, Style, UserName } from "./style"
import MatchHistory from "./MatchHistory"

function Card({ cardPosition } : { cardPosition: { top: number, left: number} }) {

	return (
		<Style $top={cardPosition.top} $left={cardPosition.left}>
			<ProfilePicture />
			<UserName>
				Example
			</UserName>
			<Score>
				0W 0D 0L
			</Score>
			<MatchHistory />
		</Style>
	)
}

export default Card