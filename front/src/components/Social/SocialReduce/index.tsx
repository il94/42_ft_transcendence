import { useEffect, useRef } from "react"
import { ReduceButton, Style, FriendsWrapper } from "./style"
import FriendReduce from "../Friend/FriendReduce"
import colors from "../../../utils/colors"

function SocialReduce({ displaySocial, socialScrollValue, setSocialScrollValue }: { displaySocial: React.Dispatch<React.SetStateAction<boolean>>, socialScrollValue: number, setSocialScrollValue: React.Dispatch<React.SetStateAction<number>> }) {

	const scrollContainerRef = useRef(null)

	useEffect(() => {
		const scrollContainer: any = scrollContainerRef.current

		if (scrollContainer)
			scrollContainer.scrollTop = socialScrollValue
	}, [])

	function handleScroll(event: any) {
		setSocialScrollValue(event.currentTarget.scrollTop);
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
			<ReduceButton	onClick={() => displaySocial(false)}
							title="Extend" />
		</Style>
	)
}

export default SocialReduce