import { useRef, RefObject, SetStateAction, Dispatch } from "react"

import {
	Style,
	ProfileWrapper,
	ButtonsWrapper,
	Icon,
	ProfileName,
	ProfilePicture
} from "./style"

import deconnexionIcon from "../../assets/deconnexion.png"
import settingsIcon from "../../assets/settings.png"

type ProfileProps = {
	displayCard: Dispatch<SetStateAction<boolean>>,
	setCardPosition: Dispatch<SetStateAction<{ top: number, left: number }>>
}

function Profile({ displayCard, setCardPosition} : ProfileProps ) {

	const profileContainerRef : RefObject<HTMLElement> = useRef(null)

	function showCard() {
		
		const profileContainer = profileContainerRef.current

		if (profileContainer)
		{
			const { width: widthParentElement } = profileContainer.parentElement!.parentElement!.getBoundingClientRect()
			
			setCardPosition({ top: 0, left: widthParentElement - 240}) // width de la carte
			displayCard(true)
		}
		
	}

	return (
		<Style>
			<ProfileWrapper onClick={showCard} ref={profileContainerRef}>
				<ProfilePicture />
				<ProfileName>
					WWWWWWWW
				</ProfileName>
			</ProfileWrapper>
			<ButtonsWrapper>
				<Icon src={settingsIcon} alt="Settings button" title="Settings" />
				<Icon src={deconnexionIcon} alt="Deconnexion button" title="Deconnexion" />
			</ButtonsWrapper>
		</Style>
	)
}

export default Profile