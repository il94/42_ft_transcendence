import {
	Dispatch,
	SetStateAction,
	useContext
} from "react"

import { Style, ReduceButton } from "./style"

import FriendSection from "./FriendSection"
import ScrollBar from "../../componentsLibrary/ScrollBar"
import ErrorRequest from "../../componentsLibrary/ErrorRequest"

import CardContext from "../../contexts/CardContext"

import { User } from "../../utils/types"

import colors from "../../utils/colors"

type PropsSocial = {
	social: boolean,
	displaySocial: Dispatch<SetStateAction<boolean>>,
	friends: User[] | undefined,
	displayContextualMenu: Dispatch<SetStateAction<{
		display: boolean,
		type: string
	}>>,
	setContextualMenuPosition: Dispatch<SetStateAction<{
		left?: number,
		top?: number,
		bottom?: number
	}>>
}

function Social({ friends, social, displaySocial, displayContextualMenu, setContextualMenuPosition }: PropsSocial) {

	const { displayCard } = useContext(CardContext)!

	function reduceSocial() {
		displaySocial(!social)
		if (!social)
			displayCard(false)
	}

	return (
		<Style onContextMenu={(event) => event.preventDefault()}>
			{
				friends ?
					<>
						<ScrollBar>
							{
								friends.map((friend, index) => (
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
					</>
					:
					<ErrorRequest />
			}
		</Style>
	)
}

export default Social