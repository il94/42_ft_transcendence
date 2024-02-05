import styled from 'styled-components'
import {
	Link
} from 'react-router-dom'

import colors from '../../utils/colors'
import effects from '../../utils/effects'

const LinkButton = styled(Link) <{ width?: number, fontSize?: number, alt: string, title: string }>`

	width: ${(props) => props.width ? props.width + "px" : "auto"};

	padding-top: 1px;
	padding-left: ${(props) => props.width ? 1 : 11}px;
	padding-bottom: 3px;
	padding-right: ${(props) => props.width ? 3 : 13}px;;

	cursor: pointer;

	font-size: ${(props) => props.fontSize}px;
	text-decoration: none;
	text-align: center;

	${effects.shadowButton};
	clip-path: ${effects.pixelateWindow};
	
	color: ${colors.text};
	background-color: ${colors.button};

	&:hover {
		transform: scale(1.015);
	}
	&:active {
		transform: scale(0.95);
		transform: translate(2px, 2px);
		background-color: ${colors.shadowButton};
		border-color: ${colors.shadowButton};
	}
	&:focus-visible {
		outline: none;
		${effects.focusShadowButton};
		background-color: ${colors.focusButton};
	}

`

export default LinkButton