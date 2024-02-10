import {
	RefObject
} from "react"

import styled from "styled-components"

import {
	userStatus
} from "../../../utils/status"

import colors from "../../../utils/colors"

export const Style = styled.div<{ $sectionIndex: number, $isBlocked: boolean, ref: RefObject<HTMLElement> }>`

	display: flex;
	justify-content: center;
	align-items: center;

	position: relative;

	width: 100%;
	min-width: 100%;
	height: 53px;
	min-height: 53px;		

	cursor: pointer;

	opacity: ${(props) => props.$isBlocked && 0.5};

	background-color: ${(props) => props.$sectionIndex % 2 === 0 ? colors.section : colors.sectionAlt};

	&:hover {
		background-color: ${(props) => props.$sectionIndex % 2 === 0 ? colors.sectionHover : colors.sectionAltHover};
	}
	&:focus-visible {
		outline: none;	
		background-color: ${(props) => props.$sectionIndex % 2 === 0 ? colors.sectionFocus : colors.sectionAltFocus};
	}

`

export const Status = styled.div<{ $sectionIndex: number, $status: userStatus }>`

	position: absolute;
	bottom: 2.5px;
	left: 35.5px;
	transform: translate(-50%, -50%);

	width: 8px;
	height: 8px;

	border: 2px solid ${colors.statusBorder};
	border-radius: 50%;

	background-color: ${(props) => props.$status === userStatus.ONLINE ? colors.online
						: props.$status === userStatus.OFFLINE ? colors.offline
						: colors.busy};

`

export const Avatar = styled.img<{ src: string }>`
	
	width: 32px;
	height: 32px;
	min-width: 32px;

	margin-left: 8px;
	margin-right: auto;

	border-radius: 50%;
	
	object-fit: cover; 
	object-position: center;

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