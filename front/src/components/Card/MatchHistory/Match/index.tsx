import Score from "./Score"
import { Opponent, Style, Username } from "./style"

type MatchProps = {
	username: string,
	opponent: string,
	color: string
}

function Match({ username, opponent, color } : MatchProps ) {
	return (
		<Style color={color}>
			<Username>
				{username}
			</Username>
			<Score />
			<Opponent>
				{opponent}
			</Opponent>
		</Style>
	)
}

export default Match