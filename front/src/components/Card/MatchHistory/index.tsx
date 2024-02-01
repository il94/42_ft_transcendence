import {
	useContext,
	useEffect,
	useState
} from "react"
// import axios from "axios"

import {
	Style
} from "./style"

import Match from "./Match"
import ScrollBar from "../../../componentsLibrary/ScrollBar"

import InteractionContext from "../../../contexts/InteractionContext"

import {
	MatchData
} from "../../../utils/types"

import {
	matchResultStatus
} from "../../../utils/status"


function MatchHistory() {

	const { userTarget } = useContext(InteractionContext)!

	const [matchs, setMatchs] = useState<MatchData[]>([])

	useEffect(() => {
		async function fetchMatchs() {
			try {

				/* ============ Temporaire ============== */

				// const response = await axios.get(`http://${url}:3333/user/:id/history`) //(id etant userIdTarget)
				// setMatchs(response.data)		

				setMatchs([
					{
						id: 0,
						user: userTarget,
						opponent: userTarget,
						result: matchResultStatus.WIN,
						scoreUser: 15,
						scoreOpponent: 0
					},
					{
						id: 1,
						user: userTarget,
						opponent: userTarget,
						result: matchResultStatus.DRAW,
						scoreUser: 10,
						scoreOpponent: 10
					},
					{
						id: 2,
						user: userTarget,
						opponent: userTarget,
						result: matchResultStatus.LOOSE,
						scoreUser: 0,
						scoreOpponent: 999
					}
				])

				/* ====================================== */

			}
			catch (error) {
				setMatchs([])
			}
		}
		fetchMatchs()
	}, [userTarget])

	return (
		<Style>
			<ScrollBar>
				{
					matchs.map((match, index) => (
						<Match
							key={"match" + index} // a definir
							username={match.user.username}
							opponent={match.opponent.username}
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