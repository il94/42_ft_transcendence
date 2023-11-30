import styled from "styled-components"
import effects from "../../../utils/effects"

export const Style = styled.div<{ $top: number }>`

	display: flex;
	flex-direction: column;

	position: absolute;
	top: ${(props) => props.$top}px;
	left: 180px;

	width: 180px;

	clip-path: ${effects.pixelateWindow};

	&:focus {
		outline: none;
	}

`