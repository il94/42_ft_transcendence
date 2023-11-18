import { Style, ProfileWrapper, ButtonsWrapper, Icon, ProfileName, ProfilePicture } from "./style"
import deconnexionIcon from "../../assets/deconnexion.png"
import settingsIcon from "../../assets/settings.png"
import { RefObject, useRef } from "react"

function Profile({ displayCard, setCardPosition} : { displayCard: React.Dispatch<React.SetStateAction<boolean>>, setCardPosition: React.Dispatch<React.SetStateAction<{ top: number, left: number }>>}) {

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
					Example
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