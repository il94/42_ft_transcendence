import {
	Dispatch,
	SetStateAction,
	useContext
} from "react"

import { Style, ReduceButton } from "./style"

import FriendSection from "./FriendSection"
import ScrollBar from "../../componentsLibrary/ScrollBar"

import CardContext from "../../contexts/CardContext"

import { User } from "../../utils/types"
import { contextualMenuStatus } from "../../utils/status"

import { sortUserByName, sortUserByStatus } from "../../utils/functions"

import colors from "../../utils/colors"

type PropsSocial = {
	social: boolean,
	displaySocial: Dispatch<SetStateAction<boolean>>,
	friends: User[],
	displayContextualMenu: Dispatch<SetStateAction<{
		display: boolean,
		type: contextualMenuStatus | undefined
	}>>,
	setContextualMenuPosition: Dispatch<SetStateAction<{
		left?: number,
		top?: number,
		bottom?: number
	}>>
}

function Social({ social, displaySocial, friends, displayContextualMenu, setContextualMenuPosition }: PropsSocial) {

	const { displayCard } = useContext(CardContext)!

	function reduceSocial() {
		displaySocial(!social)
		if (!social)
			displayCard(false)
	}

	const sortedFriends = friends.sort(sortUserByName).sort(sortUserByStatus)

	return (
		<Style onContextMenu={(event) => event.preventDefault()}>
			<ScrollBar>
				{
					sortedFriends.map((friend, index) => (
						<FriendSection
							key={"friend" + index} // a definir
							friend={friend}
							backgroundColor={!(index % 2) ? colors.section : colors.sectionAlt}
							social={social}
							displayContextualMenu={displayContextualMenu}
							setContextualMenuPosition={setContextualMenuPosition}
						/>
					))
				}
			</ScrollBar>
			<ReduceButton onClick={reduceSocial} title="Reduce">
				{
					social ?
					<>
						&gt;&gt;
					</>
					:
					<>
						&lt;&lt;
					</>
				}
			</ReduceButton>
		</Style>
	)
}

export default Social