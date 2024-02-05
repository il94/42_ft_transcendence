import styled from "styled-components"

import colors from "../../utils/colors"
import effects from "../../utils/effects"

export const Style = styled.div<{ $zIndex: number }>`

	position: absolute;
	top: 50%;
	left: 50%;
	z-index: ${(props) => props.$zIndex};
	transform: translate(-50%, -50%);

	width: 350px;
	height: 475px;

	clip-path: ${effects.pixelateWindow};

	background-color: ${colors.module};

`

export const TwoFAValue = styled.p`

	width: 100%;

	border-bottom: 1px solid;
	text-align: center;

	background-color: inherit;

`