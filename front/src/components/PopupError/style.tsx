import styled from "styled-components"

import colors from "../../utils/colors"
import effects from "../../utils/effects"

export const Style = styled.div`

	display: flex;
	justify-content: center;
	align-items: center;

	position: absolute;
	left: 50%;
	top: 50%;
	z-index: 9999;
	transform: translate(-50%, -50%);

	width: 325.5px;
	min-height: 55px;
	clip-path: ${effects.pixelateWindow};

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