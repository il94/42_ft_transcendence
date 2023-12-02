import { Style } from "./style"

import Match from "./Match"
import ScrollBar from "../../../componentsLibrary/ScrollBar"

type PropsMatchHistory = {
	username: string,
	/* cardIdTarget: number */
}

function MatchHistory({ username /*, cardIdTarget */ } : PropsMatchHistory) {

	/* ============ Temporaire ============== */

	// Recup l'historique du User avec un truc du style
	// axios.get("http://localhost:3333/user/:id/history") (id etant cardIdTarget)

	const matchs = [
		{
			id: 110,
			opponent: "match_00",
			result: "win",
			scoreUser: 15,
			scoreOpponent: 0
		},
		{
			id: 111,
			opponent: "match_01",
			result: "draw",
			scoreUser: 10,
			scoreOpponent: 10
		},
		{
			id: 112,
			opponent: "match_02",
			result: "loose",
			scoreUser: 0,
			scoreOpponent: 999
		}
	]

	/* ============================================== */

	return (
		<Style>
			<ScrollBar>
			{
				matchs.map((match) => (
					<Match
						key={"match" + match.id} // a definir
						username={username}
						opponent={match.opponent}
						result={match.result}
						scoreUser={match.scoreUser}
						scoreOpponent={match.scoreOpponent}
					/>
				))
			}
			</ScrollBar>
		</Style>
	)
}

export default MatchHistory