import {
	Dispatch,
	SetStateAction,
	useContext
} from "react"

import {
	Style,
	ReduceButton
} from "./style"

import FriendSection from "./FriendSection"
import ScrollBar from "../../componentsLibrary/ScrollBar"
import Loader from "../../componentsLibrary/Loader"

import CardContext from "../../contexts/CardContext"
import DisplayContext from "../../contexts/DisplayContext"

import {
	sortUserByName,
	sortUserByStatus
} from "../../utils/functions"

import {
	User
} from "../../utils/types"

import {
	contextualMenuStatus
} from "../../utils/status"

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
	const { loaderFriends } = useContext(DisplayContext)!

	function reduceSocial() {
		const newState = !social
		displaySocial(newState)
		if (newState === false)
			displayCard(false)
	}

	const sortedFriends = friends.sort(sortUserByName).sort(sortUserByStatus)

	return (
		<Style onContextMenu={(event) => event.preventDefault()}>
			{
				loaderFriends ?
					<Loader size={50} />
					:
						<>
							<ScrollBar>
								{
									sortedFriends.map((friend, index) => (
										<FriendSection
											key={"friend" + friend.id}
											friend={friend}
											social={social}
											displayContextualMenu={displayContextualMenu}
											setContextualMenuPosition={setContextualMenuPosition}
											sectionIndex={index}
										/>
									))
								}
							</ScrollBar>
							<ReduceButton onClick={reduceSocial} title="Reduce">
							{
								social ?
								<>
									&lt;&lt; 
								</>
								:
								<>
									&gt;&gt;
								</>
							}
							</ReduceButton>
						</>
			}
			</Style>
	)
}

export default Social