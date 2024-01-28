import styled from "styled-components"

import colors from "../../../utils/colors"
import effects from "../../../utils/effects"

export const Style = styled.div`

	display: flex;
	flex-direction: column;

	position: absolute;
	left: 50%;
	top: 50%;
	z-index: 999;
	transform: translate(-50%, -50%);

	width: 315.5px;
	border: 5px solid ${colors.sectionContextualMenu};
	clip-path: ${effects.pixelateWindow};

	text-align: center;

	background-color: ${colors.sectionContextualMenu};

	&:focus {
		outline: none;
	}

`

export const CloseButton = styled.div`

	position: absolute;
	right: 1.5px;

`

export const MessageError = styled.p`
	
	text-align: center;

`