import styled from 'styled-components'

import colors from '../../utils/colors'
import effects from '../../utils/effects'

const Button = styled.button<{ width?: number, fontSize?: string, alt: string, title: string }>`

	width: ${(props) => props.width ? props.width + "px" : "auto"};

	padding-top: 1px;
	padding-left: 11px;
	padding-bottom: 3px;
	padding-right: 13px;

	cursor: pointer;

	font-size: ${(props) => props.fontSize && props.fontSize};
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

export default Button