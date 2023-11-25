import {
	useRef,
	RefObject,
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
	username: string,
	displayCard: Dispatch<SetStateAction<boolean>>,
	setCardPosition: Dispatch<SetStateAction<{ top: number, left: number }>>,
	settings: boolean,
	displayMenuSettings: Dispatch<SetStateAction<boolean>>
}

function Profile({ username, displayCard, setCardPosition, settings, displayMenuSettings }: PropsProfile) {

	const profileContainerRef: RefObject<HTMLElement> = useRef(null)

	function showCard() {

		const profileContainer = profileContainerRef.current

		if (profileContainer) {
			const { width: widthParentElement } = profileContainer.parentElement!.parentElement!.getBoundingClientRect()

			setCardPosition({ top: 0, left: widthParentElement - 240 }) // width de la carte
			displayCard(true)
		}
	}

	return (
		<Style>
			<ProfileWrapper onClick={showCard} ref={profileContainerRef}>
				<ProfilePicture />
				<ProfileName>
					{username}
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