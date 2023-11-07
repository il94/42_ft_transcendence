import styled from "styled-components"

import colors from "../../../utils/colors"

export const Style = styled.div`

	display: flex;
	justify-content: center;
	align-items: center;

	width: 48px;
	min-width: 48px;
	height: 53px;
	min-height: 53px;

	background-color: ${(props) => props.color};

`

export const ProfilePicture = styled.div`
	
	width: 32px;
	height: 32px;

	background-color: ${colors.profilePicture};

	border-radius: 50%;

`