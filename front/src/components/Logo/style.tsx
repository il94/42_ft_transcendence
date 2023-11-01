import styled from "styled-components"
import { Link } from 'react-router-dom'

import colors from "../../utils/colors"
import effects from "../../utils/effects"

export const Style = styled.div`

	width: 100%;
	height: 53px;
	min-height: 53px;

	background-color: #FDE14F;

`

export const StyledLink = styled(Link)`

	color: ${colors.text};

	text-decoration: none;
	
`