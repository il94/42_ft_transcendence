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
import MenuContextual from "./MenuContextual"

import CardContext from "../../contexts/CardContext"

import { User } from "../../utils/types"

import colors from "../../utils/colors"

type PropsSocial = {
	social: boolean,
	displaySocial: Dispatch<SetStateAction<boolean>>,
	menuContextual: boolean,
	displayMenuContextual: Dispatch<SetStateAction<boolean>>,
	menuContextualPosition: {
		top: number,
		left: number
	},
	setMenuContextualPosition: Dispatch<SetStateAction<{
		top: number,
		left: number
	}>>
}

function Social({ social, displaySocial, menuContextual, displayMenuContextual, menuContextualPosition, setMenuContextualPosition } : PropsSocial) {

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
			{
				menuContextual &&
				<MenuContextual
					position={menuContextualPosition}
					displayMenuContextual={displayMenuContextual} />
			}
			<ScrollBar>
			{
				friends.map((friend, index) => (
					<FriendSection
						key={"friend" + index} // a definir
						id={friend.id}
						username={friend.username}
						profilePicture={friend.avatar} // a renomer par profilePicture
						state={friend.state}
						social={social}
						color={!(index % 2) ? colors.section : colors.sectionAlt}
						displayMenuContextual={displayMenuContextual}
						setMenuContextualPosition={setMenuContextualPosition} />
				))
			}
			</ScrollBar>
			<ReduceButton onClick={reduceSocial} title="Reduce" />
		</Style>
	)
}

export default Social