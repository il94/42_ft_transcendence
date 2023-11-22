import { useContext } from "react"
import { Style, ReduceButton } from "./style"
import Friend from "./Friend"
import ScrollBar from "../ScrollBar"
import CardContext from "../../contexts/CardContext"
import colors from "../../utils/colors"

type SocialProps = {
	social: boolean,
	displaySocial: React.Dispatch<React.SetStateAction<boolean>>
}

function Social({ social, displaySocial }: SocialProps ) {

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