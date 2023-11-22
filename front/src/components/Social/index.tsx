import { useContext } from "react"
import { Style, ReduceButton } from "./style"
import Friend from "./Friend"
import colors from "../../utils/colors"
import { CardContext } from "../../pages/Game"
import ScrollBar from "../ScrollBar"

function Social({ social, displaySocial }: { social: boolean, displaySocial: React.Dispatch<React.SetStateAction<boolean>> }) {

	const { displayCard } = useContext(CardContext)!

	function reduceSocial() {
		displaySocial(!social)
		if (!social)
			displayCard(false)
	}

	return (
		<Style>
			<ScrollBar>
				<Friend social={social} color={colors.section} />
				<Friend social={social} color={colors.sectionAlt} />
				<Friend social={social} color={colors.section} />
				<Friend social={social} color={colors.sectionAlt} />
				<Friend social={social} color={colors.section} />
				<Friend social={social} color={colors.sectionAlt} />
				<Friend social={social} color={colors.section} />
				<Friend social={social} color={colors.sectionAlt} />
				<Friend social={social} color={colors.section} />
				<Friend social={social} color={colors.sectionAlt} />
				<Friend social={social} color={colors.section} />
				<Friend social={social} color={colors.sectionAlt} />
				<Friend social={social} color={colors.section} />
				<Friend social={social} color={colors.sectionAlt} />
				<Friend social={social} color={colors.section} />
				<Friend social={social} color={colors.sectionAlt} />
				<Friend social={social} color={colors.section} />
				<Friend social={social} color={colors.sectionAlt} />
			</ScrollBar>
			<ReduceButton onClick={reduceSocial} title="Reduce" />
		</Style>
	)
}

export default Social