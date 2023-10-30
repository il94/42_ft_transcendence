import { styled } from 'styled-components'

import colors from '../../utils/colors'
import effects from '../../utils/effects'

export const GamePage = styled.div`

	display: flex;
	justify-content: center;
	align-items: center;

	width: 100%;
	height: 100%;

	background-color: ${colors.background}; 

	// A paramétrer plus tard pour changer la disposition sous 1280px
	/* @media (min-width: 0px) and (max-width: 1280px) {
	} */

`

export const GameWrapper = styled.div`

	display: grid;
	grid-template-columns: 240px 80.26%;
	grid-template-rows: 53px 92.25%;

	// Tailles de référence responsives
	/* grid-template-columns: 19.74% 80.26%;
	grid-template-rows: 7.75% 92.25%; */

	// Tailles de référence pas responsives
	/* grid-template-columns: 240px 976px;
	grid-template-rows: 53px 631px; */


	width: 95%;
	height: 95%;
	/* min-width: à définir par rapport au Pong */
	/* min-height: 212px; */

	${effects.pixelateWindow};

	/* @media (min-width: 0px) and (max-width: 1280px) {

		// Tailles de référence (pas responsive !)
		grid-template-columns: 976px;
		grid-template-rows: 53px 631px;

	} */

`