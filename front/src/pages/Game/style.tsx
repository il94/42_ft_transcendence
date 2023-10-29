import { styled } from 'styled-components'

import colors from '../../utils/colors'
import effects from '../../utils/effects'

export const GamePage = styled.div`

/* @media (min-width: 1280px) { */

	display: flex;
	justify-content: center;
	align-items: center;
	
	width: 100%;
	height: 100%;
	
	background-color: ${colors.background};

/* } */


// A paramétrer plus tard pour changer la disposition sous 1280px
/* @media (min-width: 0px) and (max-width: 1280px) {
} */
`

export const GameWrapper = styled.div`

/* @media (min-width: 1280px) { */

	display: grid;
	grid-template-columns: 19.4% 80.6%;
	grid-template-rows: 7.75% 92.25%;
	grid-column-gap: 0px;
	grid-row-gap: 0px;
	
	/*
		Taille de reference :
			width: 1280px;
			height: 720px;
	*/

	width: 95%;
	height: 95%;
	min-height: 265px;
	
	
	background-color: ${colors.popup};
	clip-path: ${effects.pixelateBorder};

/* } */

`