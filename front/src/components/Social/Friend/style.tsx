import { RefObject } from "react"
import styled from "styled-components"
import colors from "../../../utils/colors"

export const Style = styled.div<{ ref: RefObject<HTMLElement> }>`

	display: flex;
	justify-content: center;
	align-items: center;

	position: relative;

	width: 100%;
	min-width: 100%;
	height: 53px;
	min-height: 53px;

	background-color: ${(props) => props.color};

	&:hover {
		cursor: pointer;
		background-color: ${colors.sectionHover};
	}

`

export const ProfilePicture = styled.div`
	
	width: 32px;
	height: 32px;
	min-width: 32px;

	margin-left: 8px;
	margin-right: auto;

	border-radius: 50%;
	
	background-color: ${colors.profilePicture};

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