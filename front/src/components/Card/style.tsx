import styled from "styled-components"
import colors from "../../utils/colors"
import effects from "../../utils/effects"

export const Style = styled.div<{$top: string, $left: string, $zIndex: number}>`

	display: flex;

	flex-direction: column;
	align-items: center;

	position: absolute;
	left: ${(props) => props.$left};
	top: ${(props) => props.$top};
	z-index: ${(props) => props.$zIndex};

	width: 240px;
	height: 371px;
	min-width: 240px;
	min-height: 371px;

	${effects.pixelateWindow};

	background-color: ${colors.module};
	
`

export const TopWrapper = styled.div`

	display: flex;
	justify-content: flex-end;

	width: 100%;
	height: 121px;
	min-width: 100%;
	min-height: 121px;

`

export const CloseButton = styled.div`

	margin-top: 6.5px;
	margin-right: 6.5px;

`

export const ProfilePicture = styled.div`

	width: 92px;
	height: 92px;
	min-width: 92px;
	min-height: 92px;

	margin-top: 9px;
	margin-left: 64px;
	margin-right: auto;
	border: 10px solid ${colors.rankGold};

	border-radius: 50%;

	background-color: ${colors.profilePicture};

`

export const UserName = styled.p`

	margin-top: 5px;

	font-size: 27px;

`