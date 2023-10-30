import styled from "styled-components"

import colors from "../../utils/colors"
import effects from "../../utils/effects"

export const Style = styled.div`

	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	height: 7.75%;
	min-height: 53px;

	background-color: ${colors.profile};
	
`

export const ProfilWrapper = styled.div`
	
	display: flex;
	justify-content: flex-start;
	align-items: center;

	margin-left: 3.34%;

	width: 63.96%;
	height: 100%;

	// a definir
	/* &:hover {
		cursor: pointer;
		background-color: #9E5B29;


		${effects.pixelateWindow};
	} */

`

export const ProfilePicture = styled.div`
	
	width: 22.19%;
	height: 60.38%;

	background-color: ${colors.profilePicture};

	border-radius: 50%;

`

export const ProfileName = styled.p`
	
	margin-left: 5.58%;

`

export const ButtonsWrapper = styled.div`
	
	display: flex;
	justify-content: space-between;
	align-items: center;

	padding-right: 2.71%;

	width: 36.04%;
	height: 100%;

`

export const Icon = styled.img`

	width: 37px;
	width: 39.78%;

	cursor: pointer;

	${effects.pixelateIcon};
	${effects.shadowButton};


	border-width: 0.2em; // a definir
	/* border-width: 2.5px; */

`
