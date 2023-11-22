import { Style } from "./style"

import Match from "./Match"
import ScrollBar from "../../ScrollBar"

import colors from "../../../utils/colors"

function MatchHistory() {

	return (
		<Style>
			<ScrollBar>
				<Match color={colors.historyWin}/>
				<Match color={colors.historyWin}/>
				<Match color={colors.historyLoose}/>
				<Match color={colors.historyDraw}/>
				<Match color={colors.historyWin}/>
				<Match color={colors.historyLoose}/>
			</ScrollBar>
		</Style>
	)
}

export default MatchHistory