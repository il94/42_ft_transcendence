import { Dispatch, SetStateAction, useContext } from "react"

import { Style, ReduceButton } from "./style"

import Friend from "./Friend"
import ScrollBar from "../../componentsLibrary/ScrollBar"
import MenuContextual from "../MenuContextual"

import CardContext from "../../contexts/CardContext"
import MenuContextualContext from "../../contexts/MenuContextualContext"

import { User } from "../../utils/types"

import colors from "../../utils/colors"

import DefaultRedProfilePicture from "../../assets/default_red.png"
import DefaultYellowProfilePicture from "../../assets/default_yellow.png"
import DefaultGreenProfilePicture from "../../assets/default_green.png"

type PropsSocial = {
	social: boolean,
	displaySocial: Dispatch<SetStateAction<boolean>>
}

function Social({ social, displaySocial } : PropsSocial) {

	const { displayCard } = useContext(CardContext)!
	const { menuInteraction, menuInteractionPosition } = useContext(MenuContextualContext)!

	/* ============ Temporaire ============== */

	// Recup les User ami du User authentifie avec un truc du style
	// axios.get("http://localhost:3333/users

	const friendsTest: User[] = [
		{
			id: 10,
			username: "sbelabba",
			hash: "password",
			profilePicture: DefaultRedProfilePicture,
			state: "En jeu",
			scoreResume: {
				wins: 0,
				draws: 0,
				looses: 0
			}
		},
		{
			id: 11,
			username: "cchapon",
			hash: "password",
			profilePicture: DefaultYellowProfilePicture,
			state: "En recherche de partie...",
			scoreResume: {
				wins: 0,
				draws: 0,
				looses: 0
			}
		},
		{
			id: 12,
			username: "adouay",
			hash: "password",
			profilePicture: DefaultGreenProfilePicture,
			state: "Deconnecte",
			scoreResume: {
				wins: 0,
				draws: 0,
				looses: 0
			}
		}
	]

	/* ============================================== */

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
				friendsTest.map((friend, index) => (
					<Friend
						key={"friend" + index} // a definir
						id={friend.id}
						username={friend.username}
						profilePicture={friend.profilePicture}
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