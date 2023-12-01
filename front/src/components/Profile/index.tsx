import {
	SetStateAction,
	Dispatch,
	useContext,
	MouseEvent,
	useRef
} from "react"

import {
	Style,
	ProfileWrapper,
	ButtonsWrapper,
	ProfileName,
	ProfilePicture,
} from "./style"

import ZIndexContext from "../../contexts/ZIndexContext"

import Icon from "../../componentsLibrary/Icon"

import deconnexionIcon from "../../assets/deconnexion.png"
import settingsIcon from "../../assets/settings.png"

type PropsProfile = {
	userData: {
		username: string,
		profilePicture: string,
		id: number,
		scoreResume: {
			wins: number,
			draws: number,
			looses: number
		}
	},
	card: boolean,
	displayCard: Dispatch<SetStateAction<boolean>>,
	cardIdTarget: number,
	setIdTargetCard: Dispatch<SetStateAction<number>>,
	setCardPosition: Dispatch<SetStateAction<{ top: number, left: number }>>,
	settings: boolean,
	displayMenuSettings: Dispatch<SetStateAction<boolean>>
}

function Profile({ userData, card, displayCard, cardIdTarget, setIdTargetCard, setCardPosition, settings, displayMenuSettings }: PropsProfile) {

	const { zChatIndex, setZCardIndex } = useContext(ZIndexContext)!
	const profileRef = useRef(null)


	function showCard(event: MouseEvent<HTMLDivElement>) {

		if (card && cardIdTarget === userData.id)
			displayCard(false)
		else
		{
			const profileContainer = profileRef.current

			if (profileContainer)
			{

				const parentElementContainer = profileContainer.parentElement!
				const { left: leftProfileContainer, right: rightProfileContainer } = profileContainer!.getBoundingClientRect()
				
				console.log("===========================================")
				// console.log(profileContainer)
				console.log(parentElementContainer)
				console.log(parentElementContainer.getBoundingClientRect())
				console.log("left = ", leftProfileContainer)
				console.log("right = ", rightProfileContainer)
				console.log("window = ", window.innerWidth)
				
				// const result = 325
				const result = parentElementContainer.getBoundingClientRect().width - 271
				
				console.log("result = ", result)
				
				setIdTargetCard(userData.id)
				setZCardIndex(zChatIndex + 1)
				setCardPosition({ top: 0, left: result }) // set la postition tout en haut a gauche - width de la carte
				displayCard(true)
			}
		}
	}

	return (
		<Style ref={profileRef}>
			<ProfileWrapper onClick={showCard}>
				<ProfilePicture src={userData.profilePicture}/>
				<ProfileName>
					{userData.username}
				</ProfileName>
			</ProfileWrapper>
			<ButtonsWrapper>
				<Icon src={settingsIcon} size="38px" onClick={() => displayMenuSettings(!settings)}
					alt="Settings button" title="Settings" />
				<Icon src={deconnexionIcon} size="38px"
					alt="Deconnexion button" title="Deconnexion" />
			</ButtonsWrapper>
		</Style>
	)
}

export default Profile