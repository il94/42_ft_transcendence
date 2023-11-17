import styled from "styled-components"
import colors from "../../utils/colors"

export const Style = styled.div<{$top: number}>`

	display: flex;

	position: absolute;
	top: ${(props) => props.$top}px;

	width: 240px;
	height: 371px;
	min-width: 240px;
	min-height: 371px;

	background-color: ${colors.module};
	
`