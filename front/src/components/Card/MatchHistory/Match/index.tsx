import { Opponent, Style, Username } from "./style"
import Score from "./Score"
import colors from "../../../../utils/colors"

type PropsMatch = {
	username: string,
	opponent: string,
	result: string,
	scoreUser: number,
	scoreOpponent: number
}

function Match({ username, opponent, result, scoreUser, scoreOpponent } : PropsMatch ) {

	const backgroundColor = result === "win" ? colors.historyWin
						: result === "draw" ? colors.historyDraw
						: colors.historyLoose

	return (
		<Style $backgroundColor={backgroundColor}>
			<Username>
				{username}
			</Username>
			<Score scoreUser={scoreUser} scoreOpponent={scoreOpponent} />
			<Opponent>
				{opponent}
			</Opponent>
		</Style>
	)
}

export default Match