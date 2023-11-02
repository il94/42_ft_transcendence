import styled from "styled-components"

import colors from "../../utils/colors"
import effects from "../../utils/effects"

export const Style = styled.div`

	width: 240px;
	height: 100%;
	min-width: 240px;
	min-height: 159px;

	display: flex;
	flex-direction: column;
	justify-content: space-between;

	background-color: ${colors.module};

`

export const TopWrapper = styled.div`
	
	display: flex;
	justify-content: center;
	align-items: center;

	width: 100%;
	height: 53px;

	background-color: ${colors.buttonBrown};
`

export const ReduceButton = styled.img`

	width: 32px;
	height: 32px;

	cursor: pointer;

	${effects.pixelateIcon};
	${effects.shadowButton};

	border-width: 0.2em; // a definir
	/* border-width: 2.5px; */

`
