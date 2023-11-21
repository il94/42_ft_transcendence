import styled from "styled-components"
import colors from "../../utils/colors"

export const Style = styled.div<{$top: number, $left: number}>`

	display: flex;

	flex-direction: column;
	justify-content: flex-start;
	align-items: center;

	position: absolute;
	left: ${(props) => props.$left}px;
	top: ${(props) => props.$top}px;

	width: 240px;
	height: 371px;
	min-width: 240px;
	min-height: 371px;

	background-color: ${colors.module};
	
`

export const ProfilePicture = styled.div`

	width: 92px;
	height: 92px;
	min-width: 92px;
	min-height: 92px;

	margin-top: 9px;
	border: 10px solid ${colors.rankGold};

	border-radius: 50%;

	background-color: ${colors.profilePicture};

`

export const UserName = styled.p`

	margin-top: 5px;

	font-size: 27px;

`

export const Score = styled.p`

	margin-top: 8px;

	font-size: 15px;

`