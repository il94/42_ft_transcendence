import { Dispatch, SetStateAction, useContext, useEffect } from "react"

import {
	CloseButton,
	Avatar,
	Style,
	TopWrapper,
	UserName
} from "./style"

import MatchHistory from "./MatchHistory"
import ScoreResume from "./ScoreResume"
import Icon from "../../componentsLibrary/Icon"

import ZIndexContext from "../../contexts/ZIndexContext"

import { User } from "../../utils/types"

import CloseIcon from "../../assets/close.png"
import DefaultAvatar from "../../assets/default_blue.png"

type PropsCard = {
	cardPosition: {
		left?: number,
		right?: number
		top?: number,
	},
	displayCard: Dispatch<SetStateAction<boolean>>
}

function Card({ cardPosition, displayCard }: PropsCard) {

	const { zChatIndex, zCardIndex, setZCardIndex } = useContext(ZIndexContext)!

	useEffect(() => {
		setZCardIndex(zChatIndex + 1)
	}, [])


	/* ============ Temporaire ============== */

	// ROUTE TESTABLE
	// Recup le bon User avec un truc du style
	// axios.get("http://localhost:3333/user/:id (id etant defini par le param id de la fonction)")

	const userTest: User = {
		id: 0,
		username: "ilandols",
		avatar: DefaultAvatar,
		status: "En ligne",
		scoreResume: {
			wins: 100,
			draws: 1,
			looses: 0	
		}
	}

	/* ============================================== */

	return (
		<Style
			onClick={() => {setZCardIndex(zChatIndex + 1)}}
			$left={cardPosition.left}
			$right={cardPosition.right}
			$top={cardPosition.top}
			$zIndex={zCardIndex}>
			<TopWrapper>
				<Avatar src={userTest.avatar}/>
				<CloseButton>
					<Icon src={CloseIcon} size="24px" onClick={() => displayCard(false)}
						alt="Close button" title="Close" />
				</CloseButton>
			</TopWrapper>
			<UserName>
				{userTest.username}
			</UserName>
			<ScoreResume
				wins={userTest.scoreResume.wins}
				draws={userTest.scoreResume.draws}
				looses={userTest.scoreResume.looses}
			/>
			<MatchHistory />
		</Style>
	)
}

export default Card