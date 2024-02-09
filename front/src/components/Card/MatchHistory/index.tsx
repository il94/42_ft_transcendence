import {
	useContext,
	useEffect,
	useState
} from "react"
import axios, { AxiosResponse } from "axios"

import {
	NoMatchMessage,
	Style
} from "./style"

import Match from "./Match"
import ScrollBar from "../../../componentsLibrary/ScrollBar"
import Loader from "../../../componentsLibrary/Loader"

import InteractionContext from "../../../contexts/InteractionContext"
import AuthContext from "../../../contexts/AuthContext"
import DisplayContext from "../../../contexts/DisplayContext"

function MatchHistory() {

	const { token, url } = useContext(AuthContext)!
	const { userTarget } = useContext(InteractionContext)!
	const { loaderMatchsHistory, setLoaderMatchsHistory, displayPopupError } = useContext(DisplayContext)!

	const [matchs, setMatchs] = useState<any[]>([])
	const [historyHeight, setHistoryHeight] = useState<number>(0)

	useEffect(() => {
		async function fetchMatchs() {
			try {
				setLoaderMatchsHistory(true)
				const matchsResponse: AxiosResponse = await axios.get(`https://${url}:3333/user/matchs/${userTarget.id}`, {
					headers: {
						'Authorization': `Bearer ${token}`
					}
				})
				setMatchs(matchsResponse.data)
				setLoaderMatchsHistory(false)
			}
			catch (error) {
				displayPopupError({ display: true })
			}
		}
		fetchMatchs()
	}, [userTarget])

	useEffect(() => {
		const height = matchs.length <= 5 ? matchs.length * 30 : 150
		setHistoryHeight(height)
	}, [matchs])

	if (matchs.length === 0)
	{
		return (
			<NoMatchMessage>
				No match
			</NoMatchMessage>
		)
	}

	return (
		<Style
			height={historyHeight}
			$loader={loaderMatchsHistory} >
			{
				<ScrollBar>
				{
					loaderMatchsHistory ?
					<Loader size={150} />
					:
					<>
					{
						matchs.map((match: any) => (
							<Match
								key={"match" + match.match.gameId}
								username={userTarget.username}
								opponent={match.challengerData.challenger}
								result={match.match.result}
								scoreUser={match.match.score}
								scoreOpponent={match.challengerData.challengerScore}
							/>
						))
					}
					</>
				}
				</ScrollBar>
			}
		</Style>
	)
}

export default MatchHistory