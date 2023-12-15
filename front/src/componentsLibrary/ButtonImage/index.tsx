import styled from 'styled-components'
import colors from '../../utils/colors'
import effects from '../../utils/effects'

const ButtonImage = styled.button<{ fontSize?: number, alt: string, title: string }>`

	display: flex;
	align-items: center;

	padding-top: 1px;
	padding-bottom: 3px;
	padding-right: 13px;
	padding-left: 6px;

	cursor: pointer;

	font-size: ${(props) => props.fontSize && props.fontSize}px;
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

`

export default ButtonImage