import { useEffect, useRef } from "react"

import { ReduceButton, Style, FriendsWrapper } from "./style"

import FriendReduce from "../../Friend/FriendReduce"

import colors from "../../../utils/colors"

function SocialReduce({ setReduce, scrollValue, setScrollValue }: { setReduce: React.Dispatch<React.SetStateAction<boolean>>, scrollValue: number, setScrollValue: React.Dispatch<React.SetStateAction<number>> }) {

	const scrollContainerRef = useRef(null)

	useEffect(() => {
		const scrollContainer: any = scrollContainerRef.current

		if (scrollContainer) {
			scrollContainer.scrollTo({ top: scrollValue})
		}
	}, [])

	function handleScroll(event: any) {
		setScrollValue(event.currentTarget.scrollTop);
	}

	return (
		<Style>
			<FriendsWrapper onScroll={handleScroll} ref={scrollContainerRef}>
				<FriendReduce color={colors.section}/>
				<FriendReduce color={colors.sectionAlt}/>
				<FriendReduce color={colors.section}/>
				<FriendReduce color={colors.sectionAlt}/>
				<FriendReduce color={colors.section}/>
				<FriendReduce color={colors.sectionAlt}/>
				<FriendReduce color={colors.section}/>
				<FriendReduce color={colors.sectionAlt}/>
				<FriendReduce color={colors.section}/>
				<FriendReduce color={colors.sectionAlt}/>
				<FriendReduce color={colors.section}/>
				<FriendReduce color={colors.sectionAlt}/>
				<FriendReduce color={colors.section}/>
				<FriendReduce color={colors.sectionAlt}/>
				<FriendReduce color={colors.section}/>
				<FriendReduce color={colors.sectionAlt}/>
				<FriendReduce color={colors.section}/>
				<FriendReduce color={colors.sectionAlt}/>
			</FriendsWrapper>
			<ReduceButton	onClick={() => setReduce(false)}
							title="Extend" />
		</Style>
	)
}

export default SocialReduce