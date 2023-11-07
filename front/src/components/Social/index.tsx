import { Style, ReduceButton, FriendsWrapper } from "./style"

import Friend from "../Friend"
import colors from "../../utils/colors"

function Social({ setReduce }: { setReduce?: React.Dispatch<React.SetStateAction<boolean>> }) {
	return (
		<Style>
			<ReduceButton	onClick={() => setReduce && setReduce(true)}
							title="Reduce" />
			<FriendsWrapper>
				<Friend color={colors.section}/>
				<Friend color={colors.sectionAlt}/>
				<Friend color={colors.section}/>
				<Friend color={colors.sectionAlt}/>
				<Friend color={colors.section}/>
				<Friend color={colors.sectionAlt}/>
				<Friend color={colors.section}/>
				<Friend color={colors.sectionAlt}/>
				<Friend color={colors.section}/>
				<Friend color={colors.sectionAlt}/>
				<Friend color={colors.section}/>
				<Friend color={colors.sectionAlt}/>
				<Friend color={colors.section}/>
				<Friend color={colors.sectionAlt}/>
				<Friend color={colors.section}/>
				<Friend color={colors.sectionAlt}/>
				<Friend color={colors.section}/>
				<Friend color={colors.sectionAlt}/>
			</FriendsWrapper>
		</Style>
	)
}

export default Social