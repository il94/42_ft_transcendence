import {
	useContext
} from "react"
import axios, { AxiosError, AxiosResponse } from "axios"

import {
	Opponent,
	Style,
	Username
} from "./style"

import Score from "./Score"

import AuthContext from "../../../../contexts/AuthContext"
import InteractionContext from "../../../../contexts/InteractionContext"
import DisplayContext from "../../../../contexts/DisplayContext"

import {
	ErrorResponse,
	User
} from "../../../../utils/types"

import {
	matchResultStatus
} from "../../../../utils/status"

import colors from "../../../../utils/colors"

type PropsMatch = {
	username: string,
	opponentId: number,
	opponentName: string,
	result: matchResultStatus,
	scoreUser: number,
	scoreOpponent: number
}

function Match({ username, opponentId, opponentName, result, scoreUser, scoreOpponent }: PropsMatch) {

	const { token, url } = useContext(AuthContext)!
	const { setUserTarget } = useContext(InteractionContext)!
	const { displayPopupError, setLoaderMatchsHistory } = useContext(DisplayContext)!

	async function showOpponentCard() {
		try {
			setLoaderMatchsHistory(true)
			const userResponse: AxiosResponse<User> = await axios.get(`${url}/user/${opponentId}`, {
				headers: {
					'Authorization': `Bearer ${token}`
				}
			})

			setUserTarget(userResponse.data)
			setLoaderMatchsHistory(false)
		}
		catch (error) {
			if (axios.isAxiosError(error)) {
				const axiosError = error as AxiosError<ErrorResponse>
				const { statusCode, message } = axiosError.response?.data!
				if (statusCode === 403 || statusCode === 404)
					displayPopupError({ display: true, message: message })
				else
					displayPopupError({ display: true })
			}
			else
				displayPopupError({ display: true })
		}
	}

	const backgroundColor =
		result === matchResultStatus.WINNER ?
			colors.historyWin
			: result === matchResultStatus.DRAW ?
				colors.historyDraw
				: colors.historyLoose

	return (
		<Style $backgroundColor={backgroundColor}>
			<Username>
				{username}
			</Username>
			<Score scoreUser={scoreUser} scoreOpponent={scoreOpponent} />
			<Opponent onClick={showOpponentCard}>
				{opponentName}
			</Opponent>
		</Style>
	)
}

export default Match