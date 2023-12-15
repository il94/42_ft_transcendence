import {
	SetStateAction,
	Dispatch
} from "react"
// import axios from "axios"

import {
	Style,
	ProfileWrapper,
	ButtonsWrapper,
	ProfileName,
	Avatar,
} from "./style"

import Icon from "../../componentsLibrary/Icon"

import { User, UserAuthenticate } from "../../utils/types"

import deconnexionIcon from "../../assets/deconnexion.png"
import settingsIcon from "../../assets/settings.png"

type PropsProfile = {
	userAuthenticate: UserAuthenticate,
	card: boolean,
	displayCard: Dispatch<SetStateAction<boolean>>,
	userTarget: User | UserAuthenticate,
	setUserTarget: Dispatch<SetStateAction<User | UserAuthenticate>>,
	setCardPosition: Dispatch<SetStateAction<{
		left?: number,
		right?: number,
		top?: number,
		bottom?: number
	}>>,
	settings: boolean,
	displaySettingsMenu: Dispatch<SetStateAction<boolean>>
}

function Profile({ userAuthenticate, card, displayCard, userTarget, setUserTarget, setCardPosition, settings, displaySettingsMenu }: PropsProfile) {

	function showCard() {
		if (card && userTarget === userAuthenticate)
			displayCard(false)
		else {
			setUserTarget(userAuthenticate)
			setCardPosition({ right: 0, top: 0 })
			displayCard(true)
		}
	}

	async function handleDeconnexionClickButton() {
		try {
			// await axios.post("http://localhost:3333/auth/logout")

		}
		catch {

		}
	}

	return (
		<Style>
			<ProfileWrapper onClick={showCard}>
				<Avatar src={userAuthenticate.avatar} />
				<ProfileName>
					{userAuthenticate.username}
				</ProfileName>
			</ProfileWrapper>
			<ButtonsWrapper>
				<Icon
					onClick={() => displaySettingsMenu(!settings)}
					src={settingsIcon} size={38}
					alt="Settings button" title="Settings" />
				<Icon
					onClick={() => handleDeconnexionClickButton()}
					src={deconnexionIcon} size={38}
					alt="Deconnexion button" title="Deconnexion" />
			</ButtonsWrapper>
		</Style>
	)
}

export default Profile