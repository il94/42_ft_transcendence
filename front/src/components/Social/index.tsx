import { useContext, useEffect, useRef } from "react"
import { Style, ReduceButton, FriendsWrapper } from "./style"
import Friend from "./Friend"
import colors from "../../utils/colors"
import { CardContext } from "../../pages/Game"

function Social({ displaySocial, socialScrollValue, setSocialScrollValue }: { displaySocial: React.Dispatch<React.SetStateAction<boolean>>, socialScrollValue: number, setSocialScrollValue: React.Dispatch<React.SetStateAction<number>> }) {

	const scrollContainerRef = useRef(null)

	useEffect(() => {
		const scrollContainer: any = scrollContainerRef.current

		if (scrollContainer)
			scrollContainer.scrollTop = socialScrollValue
	}, [])

	const { displayCard } = useContext(CardContext)!

	function reduceSocial() {
		displayCard(false)
		displaySocial(true)
	}

	function handleScroll(event: any) {
		setSocialScrollValue(event.currentTarget.scrollTop);
	}

	return (
		<Style>
			<FriendsWrapper onScroll={handleScroll} ref={scrollContainerRef}>
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
			<ReduceButton	onClick={reduceSocial} title="Reduce" />
		</Style>
	)
}

export default Social