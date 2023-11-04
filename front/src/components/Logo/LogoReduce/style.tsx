import styled from "styled-components"
import { Link } from 'react-router-dom'

import colors from "../../../utils/colors"

export const Style = styled.div`

	width: 58px;
	height: 53px;
	min-width: 58px;
	min-height: 53px;

	background-color: #FDE14F;

`

export const StyledLink = styled(Link)`

	padding-right: 100%;
	padding-bottom: 33px; // ???

	&:hover {
		background-color: #ffe76e;
	}

`