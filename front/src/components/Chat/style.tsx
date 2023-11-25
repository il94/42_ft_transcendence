import styled from "styled-components"
import effects from "../../utils/effects"

export const Style = styled.div<{ $zIndex: number }>`

	display: flex;

	position: absolute;
	right: 0;
	bottom: 0;
	z-index: ${(props) => props.$zIndex};

	width: 373px;
	height: 243px;

	${effects.pixelateWindow};

`

export const ChatButton = styled.div<{ $zIndex: number }>`

	position: absolute;
	right: 6.5px;
	bottom: 4.5px;
	z-index: ${(props) => props.$zIndex};

`