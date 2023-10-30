import { Style, ProfilWrapper, ButtonsWrapper, Icon, ProfileName, ProfilePicture } from "./style"

import deconnexionIcon from "../../assets/deconnexion.png"
import settingsIcon from "../../assets/settings.png"

function Profile() {
	return (
		<Style>
			<ProfilWrapper>
				<ProfilePicture />
				<ProfileName>
					Example
				</ProfileName>
			</ProfilWrapper>
			<ButtonsWrapper>
				<Icon src={settingsIcon} alt="Settings button" />
				<Icon src={deconnexionIcon} alt="Deconnexion button" />
			</ButtonsWrapper>
		</Style>
	)
}

export default Profile