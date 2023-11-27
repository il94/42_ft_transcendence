import Score from "./Score"
import { Opponent, Style, Username } from "./style"

type PropsMatch = {
	username: string,
	opponent: string,
	color: string
}

function Match({ username, opponent, color } : PropsMatch ) {
	return (
		<Style color={color}>
			<Username>
				{username}
			</Username>
			<Score scoreUser={0} scoreOpponent={0} />
			<Opponent>
				{opponent}
			</Opponent>
		</Style>
	)
}

export default Match