import { Dispatch, SetStateAction, useContext } from "react"

import { Style, ReduceButton } from "./style"

import Friend from "./Friend"
import ScrollBar from "../../componentsLibrary/ScrollBar"
import MenuContextual from "../MenuContextual"

import CardContext from "../../contexts/CardContext"
import MenuContextualContext from "../../contexts/MenuContextualContext"

import colors from "../../utils/colors"

type PropsSocial = {
	social: boolean,
	displaySocial: Dispatch<SetStateAction<boolean>>
}

function Social({ social, displaySocial } : PropsSocial) {

	const { displayCard } = useContext(CardContext)!
	const { menuInteraction, menuInteractionPosition } = useContext(MenuContextualContext)!

	function reduceSocial() {
		displaySocial(!social)
		if (!social)
			displayCard(false)
	}

	return (
		<Style onContextMenu={(event) => event.preventDefault()}>
			{
				menuInteraction &&
				<MenuContextual position={menuInteractionPosition} />
			}
			<ScrollBar>
				<Friend username={"WWWWWWWW"} state={"En recherche de partie..."} social={social} color={colors.section} />
				<Friend username={"ilandols"} state={"En recherche de partie..."} social={social} color={colors.sectionAlt} />
				<Friend username={"cchapon"} state={"En recherche de partie..."} social={social} color={colors.section} />
				<Friend username={"adouay"} state={"En recherche de partie..."} social={social} color={colors.sectionAlt} />
				<Friend username={"sbelabba"} state={"En recherche de partie..."} social={social} color={colors.section} />
				<Friend username={"xniel"} state={"En recherche de partie..."} social={social} color={colors.sectionAlt} />
				<Friend username={"YOP YOP"} state={"En recherche de partie..."} social={social} color={colors.section} />
				<Friend username={"ahahaaaa"} state={"En recherche de partie..."} social={social} color={colors.sectionAlt} />
				<Friend username={"a"} state={"En recherche de partie..."} social={social} color={colors.section} />
				<Friend username={"il"} state={"En recherche de partie..."} social={social} color={colors.sectionAlt} />
				<Friend username={"faut"} state={"En recherche de partie..."} social={social} color={colors.section} />
				<Friend username={"des"} state={"En recherche de partie..."} social={social} color={colors.sectionAlt} />
				<Friend username={"noms"} state={"En recherche de partie..."} social={social} color={colors.section} />
				<Friend username={"mais"} state={"En recherche de partie..."} social={social} color={colors.sectionAlt} />
				<Friend username={"jai"} state={"En recherche de partie..."} social={social} color={colors.section} />
				<Friend username={"la"} state={"En recherche de partie..."} social={social} color={colors.sectionAlt} />
				<Friend username={"flemme"} state={"En recherche de partie..."} social={social} color={colors.section} />
				<Friend username={"finito"} state={"En recherche de partie..."} social={social} color={colors.sectionAlt} />
			</ScrollBar>
			<ReduceButton onClick={reduceSocial} title="Reduce" />
		</Style>
	)
}

export default Social