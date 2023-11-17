import { useContext, useEffect, useRef } from "react"
import { Style, ReduceButton, FriendsWrapper } from "./style"
import Friend from "./Friend"
import colors from "../../utils/colors"
import { CardContext } from "../../pages/Game"

function Social({ social, displaySocial, socialScrollValue, setSocialScrollValue }: { social: boolean, displaySocial: React.Dispatch<React.SetStateAction<boolean>>, socialScrollValue: number, setSocialScrollValue: React.Dispatch<React.SetStateAction<number>> }) {

	const scrollContainerRef = useRef(null)

	useEffect(() => {
		const scrollContainer: any = scrollContainerRef.current

		if (scrollContainer)
			scrollContainer.scrollTop = socialScrollValue
	}, [])

	const { displayCard } = useContext(CardContext)!

	function reduceSocial() {
		displaySocial(!social)
			if (!social)
				displayCard(false)
	}

	function handleScroll(event: any) {
		setSocialScrollValue(event.currentTarget.scrollTop);
	}

	return (
		<Style>
			<FriendsWrapper onScroll={handleScroll} ref={scrollContainerRef}>
				<Friend social={social} color={colors.section}/>
				<Friend social={social} color={colors.sectionAlt}/>
				<Friend social={social} color={colors.section}/>
				<Friend social={social} color={colors.sectionAlt}/>
				<Friend social={social} color={colors.section}/>
				<Friend social={social} color={colors.sectionAlt}/>
				<Friend social={social} color={colors.section}/>
				<Friend social={social} color={colors.sectionAlt}/>
				<Friend social={social} color={colors.section}/>
				<Friend social={social} color={colors.sectionAlt}/>
				<Friend social={social} color={colors.section}/>
				<Friend social={social} color={colors.sectionAlt}/>
				<Friend social={social} color={colors.section}/>
				<Friend social={social} color={colors.sectionAlt}/>
				<Friend social={social} color={colors.section}/>
				<Friend social={social} color={colors.sectionAlt}/>
				<Friend social={social} color={colors.section}/>
				<Friend social={social} color={colors.sectionAlt}/>
			</FriendsWrapper>
			<ReduceButton	onClick={reduceSocial} title="Reduce" />
		</Style>
	)
}

export default Social