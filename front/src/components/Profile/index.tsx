import {
	SetStateAction,
	Dispatch
} from "react"

import {
	Style,
	ProfileWrapper,
	ButtonsWrapper,
	ProfileName,
	ProfilePicture,
} from "./style"


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
	setCardPosition: Dispatch<SetStateAction<{
		left?: number,
		right?: number,
		top?: number
	}>>,
	settings: boolean,
	displayMenuSettings: Dispatch<SetStateAction<boolean>>
}

function Profile({ userData, card, displayCard, cardIdTarget, setIdTargetCard, setCardPosition, settings, displayMenuSettings }: PropsProfile) {

	function showCard() {
		if (card && cardIdTarget === userData.id)
			displayCard(false)
		else
		{				
			setIdTargetCard(userData.id)
			setCardPosition({ right: 0, top: 0 })
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