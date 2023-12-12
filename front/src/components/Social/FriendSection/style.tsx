import { RefObject } from "react"
import styled from "styled-components"
import colors from "../../../utils/colors"

export const Style = styled.div<{ $backgroundColor: string, ref: RefObject<HTMLElement> }>`

	display: flex;
	justify-content: center;
	align-items: center;

	position: relative;

	width: 100%;
	min-width: 100%;
	height: 53px;
	min-height: 53px;

	background-color: ${(props) => props.$backgroundColor};

	&:hover {
		cursor: pointer;
		background-color: ${colors.sectionHover};
	}

`

export const Avatar = styled.img<{ src: string }>`
	
	width: 32px;
	height: 32px;
	min-width: 32px;

	margin-left: 8px;
	margin-right: auto;

	border-radius: 50%;
	
`

export const ProfileInfo = styled.div<{ $offline: boolean }>`

	display: flex;
	justify-content: space-between;
	flex-direction: column;

	margin-left: 8px;

	width: calc(100% - 32px);
	height: 32px;

	filter: ${(props) => props.$offline && "brightness(70%)"};

`

export const ProfileName = styled.p`
	
	font-size: 13px;

	color: inherit;


`

export const ProfileStatus = styled.p`
	
	font-size: 10px;
	
	color: inherit;

`