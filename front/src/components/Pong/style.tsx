import styled from "styled-components"
import effects from "../../utils/effects"

export const Style = styled.div`

	display: flex;
	justify-content: flex-end;
	align-items: flex-end;

	width: 100%;
	height: 100%;

	background-color: #FD994F;

`

export const ChatButton = styled.img`

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