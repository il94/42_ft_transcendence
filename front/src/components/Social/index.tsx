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
				<Friend username={"WWWWWWWW"} social={social} color={colors.section} />
				<Friend username={"ilandols"} social={social} color={colors.sectionAlt} />
				<Friend username={"cchapon"} social={social} color={colors.section} />
				<Friend username={"adouay"} social={social} color={colors.sectionAlt} />
				<Friend username={"sbelabba"} social={social} color={colors.section} />
				<Friend username={"xniel"} social={social} color={colors.sectionAlt} />
				<Friend username={"YOP YOP"} social={social} color={colors.section} />
				<Friend username={"ahahaaaa"} social={social} color={colors.sectionAlt} />
				<Friend username={"a"} social={social} color={colors.section} />
				<Friend username={"il"} social={social} color={colors.sectionAlt} />
				<Friend username={"faut"} social={social} color={colors.section} />
				<Friend username={"des"} social={social} color={colors.sectionAlt} />
				<Friend username={"noms"} social={social} color={colors.section} />
				<Friend username={"mais"} social={social} color={colors.sectionAlt} />
				<Friend username={"jai"} social={social} color={colors.section} />
				<Friend username={"la"} social={social} color={colors.sectionAlt} />
				<Friend username={"flemme"} social={social} color={colors.section} />
				<Friend username={"finito"} social={social} color={colors.sectionAlt} />
			</ScrollBar>
			<ReduceButton onClick={reduceSocial} title="Reduce" />
		</Style>
	)
}

export default Social