import styled from 'styled-components'
import colors from '../../utils/colors'
import effects from '../../utils/effects'

const Icon = styled.button<{src: string, size: string, alt: string,}>`

	width: ${(props) => props.size};
	height: ${(props) => props.size};

	padding: 0;

	cursor: pointer;
	
	font-size: 16px;
	text-decoration: none;
	text-align: center;
	
	background-image: url(${(props) => props.src});
	background-size: cover;

	${effects.shadowIcon};
	${effects.pixelateIcon};
	
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

export default Icon