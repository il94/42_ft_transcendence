import {
	SetStateAction,
	Dispatch,
	useContext
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
	setCardPosition: Dispatch<SetStateAction<{ top: string, left: string }>>,
	settings: boolean,
	displayMenuSettings: Dispatch<SetStateAction<boolean>>
}

function Profile({ userData, card, displayCard, cardIdTarget, setIdTargetCard, setCardPosition, settings, displayMenuSettings }: PropsProfile) {

	const { zChatIndex, setZCardIndex } = useContext(ZIndexContext)!

	function showCard(event) {

		if (card && cardIdTarget === userData.id)
			displayCard(false)
		else
		{
			const parentElementContainer = (event.target as HTMLElement).parentElement!.parentElement!
			const { right: rightParentElement } = parentElementContainer!.getBoundingClientRect()
	
			console.log(parentElementContainer)

			setIdTargetCard(userData.id)
			setZCardIndex(zChatIndex + 1)
			setCardPosition({ top: 0, left: rightParentElement - 240 }) // set la postition tout en haut a gauche - width de la carte
			displayCard(true)
		}
	}

	return (
		<Style>
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