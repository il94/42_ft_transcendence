import styled from "styled-components"
import colors from "../../../utils/colors"
import effects from "../../../utils/effects"

export const Style = styled.div`

	display: flex;
	justify-content: space-between;
	align-items: center;

	width: 240px;
	min-width: 240px;
	height: 53px;
	min-height: 53px;

	background-color: ${(props) => props.color};

`

export const ProfileWrapper = styled.div`
	
	display: flex;
	justify-content: flex-start;
	align-items: center;

	margin-left: 8px;

	width: 100%;
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

export const ProfileInfo = styled.div`

	display: flex;
	justify-content: space-between;
	flex-direction: column;

	margin-left: 8px;

	width: calc(100% - 32px);
	height: 32px;
`

export const ProfileName = styled.p`
	
	font-size: 13px;

`

export const ProfileStatus = styled.p`
	
	font-size: 10px;
	
`