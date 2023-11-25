import styled from 'styled-components'
import { Link } from 'react-router-dom'

const StyledLink = styled(Link)<{ color: string }>`

	text-decoration: none;

	color: ${(props) => props.color};

`

export default StyledLink