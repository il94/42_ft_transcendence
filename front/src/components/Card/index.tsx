import {
	Dispatch,
	SetStateAction,
	useContext,
	useEffect,
	useState
} from "react"
import axios from "axios"

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

import CloseIcon from "../../assets/close.png"

type PropsCard = {
	cardPosition: {
		left?: number,
		right?: number
		top?: number,
	},
	displayCard: Dispatch<SetStateAction<boolean>>,
	cardIdTarget: number
}

function Card({ cardPosition, displayCard, cardIdTarget }: PropsCard) {

	const { zChatIndex, zCardIndex, setZCardIndex } = useContext(ZIndexContext)!

	type PropsUserTarget = {
		username: string,
		avatar: string,
		scoreResume: {
			wins: number,
			draws: number,
			looses: number
		}
	}

	const [userTarget, setUserTarget] = useState<PropsUserTarget>({
		username: "",
		avatar: "",
		scoreResume: {
			wins: 0,
			draws: 0,
			looses: 0
		}
	})

	useEffect(() => {
		setZCardIndex(zChatIndex + 1)
	}, [])

	useEffect(() => {
		axios.get(`http://localhost:3333/user/${cardIdTarget}`)
			.then((response) => {
				console.log(response)
				setUserTarget({
					username: response.data.username,
					avatar: response.data.avatar,
					scoreResume: {
						wins: 0, // en attente de l'obtention par le back
						draws: 0,
						looses: 0
					}
				})
			})
			.catch((error) => console.log(error))
	}, [cardIdTarget])

	return (
		<Style
			onClick={() => {setZCardIndex(zChatIndex + 1)}}
			$left={cardPosition.left}
			$right={cardPosition.right}
			$top={cardPosition.top}
			$zIndex={zCardIndex}>
			<TopWrapper>
				<Avatar src={userTarget.avatar}/>
				<CloseButton>
					<Icon onClick={() => displayCard(false)}
						src={CloseIcon} size={24}
						alt="Close button" title="Close" />
				</CloseButton>
			</TopWrapper>
			<UserName>
				{userTarget.username}
			</UserName>
			<ScoreResume
				wins={userTarget.scoreResume.wins}
				draws={userTarget.scoreResume.draws}
				looses={userTarget.scoreResume.looses} />
			<MatchHistory username={userTarget.username} /* cardIdTarget={cardIdTarget} */ />
		</Style>
	)
}

export default Card