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

export const ChatButton = styled.img<{ $zIndex: number }>`

	position: absolute;
	right: 0;
	bottom: 0;
	z-index: ${(props) => props.$zIndex};

	width: 32px;
	height: 32px;

	margin-right: 6.5px;
	margin-bottom: 4.5px;

	cursor: pointer;

	${effects.pixelateIcon};
	${effects.shadowButton};


	border-width: 0.2em; // a definir
	/* border-width: 2.5px; */

`