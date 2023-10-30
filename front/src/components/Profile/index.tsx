import { Style, Icon, ButtonsWrapper } from "./style"

import profilePicture from "../../assets/default_blue.png"
import deconnexionIcon from "../../assets/deconnexion.png"
import settingsIcon from "../../assets/settings.png"

function Profile() {
	return (
		<Style>
			Profile
			<ButtonsWrapper>
				<Icon src={settingsIcon} alt="Settings button" />
				<Icon src={deconnexionIcon} alt="Deconnexion button" />
			</ButtonsWrapper>
		</Style>
	)
}

export default Profile