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

export const ReduceButton = styled.img`

	width: 37px;
	width: 39.78%;

	cursor: pointer;

	${effects.pixelateIcon};
	${effects.shadowButton};


	border-width: 0.2em; // a definir
	/* border-width: 2.5px; */

`
