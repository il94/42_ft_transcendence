import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react"
import axios from "axios"

import { Style, ReduceButton } from "./style"

import FriendSection from "./FriendSection"
import ScrollBar from "../../componentsLibrary/ScrollBar"
import MenuContextual from "../MenuContextual"

import CardContext from "../../contexts/CardContext"
import MenuContextualContext from "../../contexts/MenuContextualContext"

import { User } from "../../utils/types"

import colors from "../../utils/colors"

type PropsSocial = {
	social: boolean,
	displaySocial: Dispatch<SetStateAction<boolean>>
}

function Social({ social, displaySocial } : PropsSocial) {

	const { displayCard } = useContext(CardContext)!
	const { menuInteraction, menuInteractionPosition } = useContext(MenuContextualContext)!

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
				menuInteraction &&
				<MenuContextual position={menuInteractionPosition} />
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
					/>
				))
			}
			</ScrollBar>
			<ReduceButton onClick={reduceSocial} title="Reduce" />
		</Style>
	)
}

export default Social