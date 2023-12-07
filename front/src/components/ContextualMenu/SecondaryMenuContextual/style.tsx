import styled from "styled-components"
import effects from "../../../utils/effects"

export const Style = styled.div<{ $left?: number, $right?: number, $bottom?: number, $top?: number, $offset: number }>`

	display: flex;
	flex-direction: column;

	position: absolute;
	left: ${(props) => props.$left && props.$left + props.$offset}px;
	right: ${(props) => props.$right && props.$right + props.$offset}px;
	top: ${(props) => props.$top && props.$top}px;
	bottom: ${(props) => props.$bottom && props.$bottom}px;
	z-index: 999;

	width: 180px;

	clip-path: ${effects.pixelateWindow};

	&:focus {
		outline: none;
	}

`