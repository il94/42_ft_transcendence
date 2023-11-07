import { Style, ProfileWrapper, ButtonsWrapper, Icon, ProfileName, ProfilePicture } from "./style"

import deconnexionIcon from "../../assets/deconnexion.png"
import settingsIcon from "../../assets/settings.png"

function Profile() {
	return (
		<Style>
			<ProfileWrapper>
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