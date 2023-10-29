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
`

export const GameWrapper = styled.div`
	display: grid;
	grid-template-columns: 19.4% 80.6%;
	grid-template-rows: 7.75% 92.25%;
	grid-column-gap: 0px;
	grid-row-gap: 0px;

	width: 95%;
	height: 95%;

	/*
		Base :
		width: 1280px;
		height: 720px;
	*/
	
	background-color: ${colors.backgroundWindow};
	clip-path: ${effects.pixelateBorder};
`