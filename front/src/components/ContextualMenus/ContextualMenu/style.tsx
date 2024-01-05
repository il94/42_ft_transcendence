import styled from "styled-components"
import effects from "../../../utils/effects"

export const Style = styled.div<{ $left?: number, $right?: number, $bottom?: number, $top?: number }>`

	display: flex;
	flex-direction: column;

	position: fixed;
	left: ${(props) => props.$left ? props.$left + "px" : "auto"};
	right: ${(props) => props.$right ? props.$right + "px" : "auto"};
	top: ${(props) => props.$top ? props.$top + "px" : "auto"};
	bottom: ${(props) => props.$bottom ? props.$bottom + "px" : "auto"};
	z-index: 999;

	width: 180px;

	clip-path: ${effects.pixelateWindow};

	&:focus {
		outline: none;
	}

`
