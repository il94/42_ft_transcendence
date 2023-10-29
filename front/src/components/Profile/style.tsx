import styled from "styled-components"

import colors from "../../utils/colors"
import effects from "../../utils/effects"

export const Style = styled.div`

	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	height: 7.75%;
	min-height: 53px;
	
	background-color: ${colors.profile};
	
`

export const ButtonsWrapper = styled.div`
	
	display: flex;
	justify-content: space-between;
	align-items: center;

	padding-right: 2.71%;

	width: 36.04%;
	height: 100%;

`

export const StyledImg = styled.img`

	width: 37px;
	width: 39.78%;

	cursor: pointer;

	${effects.pixelateIcon};
	${effects.shadowButton};


	border-width: 0.2em; // a definir
	/* border-width: 2.5px; */

`