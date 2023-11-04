import styled from "styled-components"
import { Link } from 'react-router-dom'

import colors from "../../utils/colors"

export const Style = styled.div`

	width: 58px;
	height: 58px;
	min-width: 58px;
	min-height: 58px;

	background-color: #FDE14F;

`

export const StyledLink = styled(Link)`

	color: ${colors.text};

	text-decoration: none;
	
`