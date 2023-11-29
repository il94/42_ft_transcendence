import styled from "styled-components"

export const Style = styled.div<{ $top: number, $left: number }>`

	display: flex;

	position: absolute;
	left: ${(props) => props.$left}px;
	top: ${(props) => props.$top}px;
	bottom: auto;
	z-index: 999;

	&:focus {
		outline: none;
	}

`