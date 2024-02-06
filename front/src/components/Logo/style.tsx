import styled from "styled-components"
import colors from "../../utils/colors"

export const Style = styled.div`

	display: flex;
	justify-content: center;
	align-items: center;

	width: 100%;
	height: 53px;
	min-width: 100%;
	min-height: 53px;

	background-color: ${colors.navbar};

`

export const LogoFull = styled.p`

	cursor: pointer;

	font-size: 20px;

	&:hover {
		transform: scale(1.015);
	}
	&:focus-visible {
		outline: none;	
		color: ${colors.focusText};
	}

`

export const LogoReduced = styled.img`

	width: 70%;
	height: 70%;

	cursor: pointer;

	&:hover {
		width: 72.5%;
		height: 72.5%;
	}
	&:focus-visible {
		outline: none;	
	}

`