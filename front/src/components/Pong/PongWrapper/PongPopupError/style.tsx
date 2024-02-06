import styled from "styled-components"

import colors from "../../../../utils/colors"
import effects from "../../../../utils/effects"

export const Style = styled.div`

	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;

	position: relative;

	width: 325.5px;
	min-height: 55px;
	clip-path: ${effects.pixelateWindow};

	margin: auto;

	text-align: center;

	background-color: ${colors.sectionContextualMenu};

	&:focus {
		outline: none;
	}

`

export const CloseButton = styled.div`

	position: absolute;
	top: 3.5px;
	right: 6.5px;

`

export const MessageError = styled.p`
	
	width: 275.5px;

	text-align: center;

`