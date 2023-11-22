import { Style } from "./style"

import Match from "./Match"
import ScrollBar from "../../ScrollBar"

import colors from "../../../utils/colors"

function MatchHistory() {

	return (
		<Style>
			<ScrollBar>
				<Match username={"lol"} opponent={"Example"} color={colors.historyWin}/>
				<Match username={"WWWWWWWW"} opponent={"WWWWWWWW"} color={colors.historyWin}/>
				<Match username={"Example"} opponent={"Example"} color={colors.historyLoose}/>
				<Match username={"Example"} opponent={"Example"} color={colors.historyDraw}/>
				<Match username={"Example"} opponent={"Example"} color={colors.historyWin}/>
				<Match username={"Example"} opponent={"Example"} color={colors.historyLoose}/>
			</ScrollBar>
		</Style>
	)
}

export default MatchHistory