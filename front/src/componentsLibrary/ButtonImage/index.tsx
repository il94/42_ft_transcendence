import styled from 'styled-components'
import colors from '../../utils/colors'
import effects from '../../utils/effects'

const ButtonImage = styled.button`

	display: flex;
	align-items: center;

	padding-top: 1px;
	padding-bottom: 3px;
	padding-right: 13px;

	cursor: pointer;

	font-size: 16px;
	text-decoration: none;
	text-align: center;

	${effects.shadowButton};
	${effects.pixelateWindow};
	
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