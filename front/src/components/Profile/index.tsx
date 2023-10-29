import { Style, StyledImg, ButtonsWrapper } from "./style"

import deconnexionIcon from "../../assets/deconnexion.png"
import settingsIcon from "../../assets/settings.png"

function Profile() {
	return (
		<Style>
			Profile
			<ButtonsWrapper>
				<StyledImg src={settingsIcon} alt="Settings button" />
				<StyledImg src={deconnexionIcon} alt="Deconnexion button" />
			</ButtonsWrapper>
		</Style>
	)
}

export default Profile