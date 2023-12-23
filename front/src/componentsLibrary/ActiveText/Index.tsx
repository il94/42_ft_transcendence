import styled from 'styled-components'
import colors from '../../utils/colors'

const ActiveText = styled.button <{ color?: string }>`

	text-decoration: none;

	color: ${(props) => props.color};
	background-color: inherit;

	&:hover {
		cursor: pointer;
	}

	&:active {
		color: ${(props) => props.color && props.color !== colors.text && colors.shadowButton};
	}

`

export default ActiveText