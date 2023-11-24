import { useContext } from "react"
import { CloseButton, ProfilePicture, Style, TopWrapper, UserName } from "./style"
import MatchHistory from "./MatchHistory"
import ScoreResume from "./ScoreResume"
import ZIndexContext from "../../contexts/ZIndexContext"
import CloseIcon from "../../assets/base.png"
import CardContext from "../../contexts/CardContext"

function Card({ cardPosition, username } : { cardPosition: { top: number, left: number}, username: string }) {

	const { zChatIndex, zCardIndex, setZCardIndex } = useContext(ZIndexContext)!
	const { displayCard } = useContext(CardContext)!

	return (
		<Style onClick={() => {setZCardIndex(zChatIndex + 1)}}
				$top={cardPosition.top} $left={cardPosition.left} $zIndex={zCardIndex}>
			<TopWrapper>
				<ProfilePicture />
				<CloseButton src={CloseIcon} onClick={() => displayCard(false)}
					alt="Close button" title="Close" />
			</TopWrapper>
			<UserName>
				{username}
			</UserName>
			<ScoreResume />
			<MatchHistory />
		</Style>
	)
}

export default Card