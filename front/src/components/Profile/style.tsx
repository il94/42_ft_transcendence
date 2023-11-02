import styled from "styled-components"

import colors from "../../utils/colors"
import effects from "../../utils/effects"

export const Style = styled.div`

	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	height: 53px;
	min-height: 53px;

	background-color: ${colors.profile};
	
`

export const ProfilWrapper = styled.div`
	
	display: flex;
	justify-content: flex-start;
	align-items: center;

	margin-left: 8px;

	width: 63.96%;
	height: 100%;

	// survol du username a definir
	/* &:hover {
		cursor: pointer;
		background-color: #9E5B29;


		${effects.pixelateWindow};
	} */

`

export const ProfilePicture = styled.div`
	
	width: 32px;
	height: 32px;

	background-color: ${colors.profilePicture};

	border-radius: 50%;

`

export const ProfileName = styled.p`
	
	margin-left: 8px;

`

export const ButtonsWrapper = styled.div`
	
	display: flex;
	justify-content: space-between;
	align-items: center;

	padding-right: 6.5px;

	width: 36.04%;
	height: 100%;

`

export const Icon = styled.img`

	width: 32px;
	height: 32px;

	cursor: pointer;

	${effects.pixelateIcon};
	${effects.shadowButton};


	border-width: 0.2em; // a definir
	/* border-width: 2.5px; */

`
