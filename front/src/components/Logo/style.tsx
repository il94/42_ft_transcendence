import styled from "styled-components"
import { Link } from 'react-router-dom'

export const Style = styled.div`

	width: 250px;
	height: 53px;
	min-width: 250px;
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
