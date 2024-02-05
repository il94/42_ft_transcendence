import styled from "styled-components"
import colors from "../../utils/colors"
import effects from "../../utils/effects"

const IconUploadFile = styled.label<{ src?: string, size?: number, fontSize?: number, alt: string, title: string }>`
	
	width: ${(props) => props.size ? props.size + "px" : "auto"};
	height: ${(props) => props.size ? props.size + "px" : "auto"};

	padding: 0;

	cursor: pointer;

	font-size: ${(props) => props.fontSize && props.fontSize}px;
	text-decoration: none;
	text-align: center;

	background-image: url(${(props) => props.src});
	background-size: cover;

	${effects.shadowIcon};
	clip-path: ${effects.pixelateIcon};
	
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
		${effects.focusShadowIcon};
		background-color: ${colors.focusButton};
	}

`

export default IconUploadFile

export const HiddenInput = styled.input`
	display: none;
`