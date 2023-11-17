import styled from "styled-components"
import effects from "../../utils/effects"

export const Style = styled.div`

	display: flex;

	position: absolute;
	right: 0;
	bottom: 0;

	width: 368px;
	height: 243px;

	${effects.pixelateWindow};

`

export const ChatButton = styled.img`

	position: absolute;
	right: 0;
	bottom: 0;

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