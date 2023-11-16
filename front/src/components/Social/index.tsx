import { useContext, useEffect, useRef } from "react"
import { Style, ReduceButton, FriendsWrapper } from "./style"
import Friend from "./Friend"
import colors from "../../utils/colors"
import { CardContext } from "../../pages/Game"

function Social({ setReduce, scrollValue, setScrollValue }: { setReduce: React.Dispatch<React.SetStateAction<boolean>>, scrollValue: number, setScrollValue: React.Dispatch<React.SetStateAction<number>> }) {

	const scrollContainerRef = useRef(null)

	useEffect(() => {
		const scrollContainer: any = scrollContainerRef.current

		if (scrollContainer)
			scrollContainer.scrollTop = scrollValue
	}, [])

	const { displayCard } = useContext(CardContext)!

	function reduceSocial() {
		displayCard(false)
		setReduce(true)
	}

	function handleScroll(event: any) {
		setScrollValue(event.currentTarget.scrollTop);
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