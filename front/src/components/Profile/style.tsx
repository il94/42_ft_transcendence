import styled from "styled-components"
import colors from "../../utils/colors"
import effects from "../../utils/effects"

export const Style = styled.div`

	display: flex;
	justify-content: space-between;
	align-items: center;

	width: 240px;
	min-width: 240px;

	background-color: ${colors.profile};
	
`

export const ProfileWrapper = styled.div`
	
	display: flex;
	justify-content: flex-start;
	align-items: center;
	
	height: 49px;

	padding-right: 7px;

	&:hover {
		cursor: pointer;
		background-color: #9E5B29;

		clip-path: ${effects.pixelateWindow};
	}

`

export const Avatar = styled.img`
	
	width: 32px;
	height: 32px;

	margin-left: 7px;

	border-radius: 50%;

`

export const ProfileName = styled.p`
	
	margin-left: 6px;

	text-align: center;
	font-size: 14px;

`

export const ButtonsWrapper = styled.div`
	
	display: flex;
	justify-content: space-between;
	align-items: center;

	margin-right: 6.5px;

	width: 82px;
	min-width: 82px;
	height: 100%;

`
