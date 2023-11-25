import styled from "styled-components"
import colors from "../../../../utils/colors"

export const Style = styled.div`

	display: flex;
	align-items: center;

	width: 100%;
	height: 40px;
	min-height: 40px;

	background-color: ${(props) => props.color};

	&:hover {
		cursor: pointer;
		background-color: ${colors.sectionHover};
	}

`

export const ProfilePicture = styled.div`
	
	width: 24px;
	height: 24px;

	margin-left: 6px;
	
	border-radius: 50%;

	background-color: ${colors.profilePicture};

`

export const RoomName = styled.p`
	
	margin-left: 6px;

	font-size: 12px;

	color: ${colors.text};

`