import { useContext } from "react"

import { CloseButton, ProfilePicture, Style, TopWrapper, UserName } from "./style"

import MatchHistory from "./MatchHistory"
import ScoreResume from "./ScoreResume"
import Icon from "../../componentsLibrary/Icon"

import ZIndexContext from "../../contexts/ZIndexContext"
import CardContext from "../../contexts/CardContext"

import CloseIcon from "../../assets/close.png"

function Card({ cardPosition, username } : { cardPosition: { top: number, left: number}, username: string }) {

	const { zChatIndex, zCardIndex, setZCardIndex } = useContext(ZIndexContext)!
	const { displayCard } = useContext(CardContext)!

	return (
		<Style onClick={() => {setZCardIndex(zChatIndex + 1)}}
				$top={cardPosition.top} $left={cardPosition.left} $zIndex={zCardIndex}>
			<TopWrapper>
				<ProfilePicture />
				<CloseButton>
					<Icon src={CloseIcon} size="24px" onClick={() => displayCard(false)}
						alt="Close button" title="Close"/>
				</CloseButton>
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