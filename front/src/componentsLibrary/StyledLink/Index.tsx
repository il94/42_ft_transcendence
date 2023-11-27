import styled from 'styled-components'
import { Link } from 'react-router-dom'
import colors from '../../utils/colors'

const StyledLink = styled(Link)<{ color: string }>`

	text-decoration: none;

	color: ${(props) => props.color};

	&:active {
		color: ${(props) => props.color !== colors.text && colors.shadowButton};
	}

`

export default StyledLink