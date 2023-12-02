import {
	Dispatch,
	SetStateAction,
	useContext,
	useEffect,
	useState
} from "react"
import axios from "axios"

import { Style, ReduceButton } from "./style"

import FriendSection from "./FriendSection"
import ScrollBar from "../../componentsLibrary/ScrollBar"

import CardContext from "../../contexts/CardContext"

import { User } from "../../utils/types"

import colors from "../../utils/colors"

type PropsSocial = {
	social: boolean,
	displaySocial: Dispatch<SetStateAction<boolean>>,
	displayContextualMenu: Dispatch<SetStateAction<boolean>>,
	setContextualMenuPosition: Dispatch<SetStateAction<{
		top: number,
		left: number
	}>>
}

function Social({ social, displaySocial, displayContextualMenu, setContextualMenuPosition } : PropsSocial) {

	const { displayCard } = useContext(CardContext)!

	const [friends, setFriendSections] = useState<User[]>([])

	useEffect(() => {
		axios.get("http://localhost:3333/user")
			.then((response) => {
				setFriendSections(response.data)
			})
			.catch()
	}, [])

	function reduceSocial() {
		displaySocial(!social)
		if (!social)
			displayCard(false)
	}

	return (
		<Style onContextMenu={(event) => event.preventDefault()}>
			<ScrollBar>
			{
				friends.map((friend, index) => (
					<FriendSection
						key={"friend" + index} // a definir
						id={friend.id}
						username={friend.username}
						avatar={friend.avatar}
						status={friend.status}
						social={social}
						color={!(index % 2) ? colors.section : colors.sectionAlt}
						displayContextualMenu={displayContextualMenu}
						setContextualMenuPosition={setContextualMenuPosition} />
				))
			}
			</ScrollBar>
			<ReduceButton onClick={reduceSocial} title="Reduce" />
		</Style>
	)
}

export default Social