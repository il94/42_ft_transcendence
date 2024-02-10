import styled from 'styled-components'

import colors from '../../utils/colors'

const ActiveText = styled.button <{ color?: string, $fontSize?: number }>`

	padding-right: 0;
	padding-left: 0;

	text-decoration: none;

	font-size: ${(props) => props.$fontSize && props.$fontSize}px;

	color: ${(props) => props.color};
	background-color: inherit;

	&:hover {
		cursor: pointer;
		color: ${(props) => props.color && props.color !== colors.text && colors.shadowButton};
	}
	&:active {
		color: ${(props) => props.color && props.color !== colors.text && colors.shadowButton};
	}
	&:focus-visible {
		outline: none;
		color: ${(props) => (props.color && props.color === colors.textAlt) ? colors.focusTextAlt : colors.focusText};
	}

`

export default ActiveText