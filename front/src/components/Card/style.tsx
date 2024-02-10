import styled from "styled-components"

import {
	ranks
} from "../../utils/status"

import colors from "../../utils/colors"
import effects from "../../utils/effects"

export const Style = styled.div<{ $left?: number, $right?: number, $top?: number, $bottom?: number, $zIndex: number }>`

	display: flex;

	flex-direction: column;
	align-items: center;

	position: absolute;
	left: ${(props) => props.$left}px;
	right: ${(props) => props.$right}px;
	top: ${(props) => props.$top}px;
	bottom: ${(props) => props.$bottom}px;
	z-index: ${(props) => props.$zIndex};

	width: 240px;
	height: 390px;
	min-width: 240px;
	min-height: 390px;

	clip-path: ${effects.pixelateWindow};

	background-color: ${colors.module};
	
`

export const Avatar = styled.img<{ $borderColor: string}>`

	width: 92px;
	height: 92px;
	min-width: 92px;
	min-height: 92px;

	margin-top: 9px;
	margin-left: 64px;
	margin-right: auto;

	border: 10px solid;
	border-radius: 50%;
	border-color: ${(props) => props.$borderColor === ranks.NORANK ? colors.rankNull
						: props.$borderColor === ranks.BRONZE ? colors.rankBronze
						: props.$borderColor === ranks.SILVER ? colors.rankSilver
						: props.$borderColor === ranks.GOLD ? colors.rankGold
						: null};
	object-fit: cover; 
	object-position: center;

`

export const UserName = styled.p`

	margin-top: 5px;

	font-size: 27px;

`

export const Rank = styled.p<{ $color: string}>`

	font-size: 15px;
	color: ${(props) => props.$color === ranks.NORANK ? colors.rankNull
						: props.$color === ranks.BRONZE ? colors.rankBronze
						: props.$color === ranks.SILVER ? colors.rankSilver
						: props.$color === ranks.GOLD ? colors.rankGold
						: null};
			
`