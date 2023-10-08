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
	grid-template-columns: repeat(5, 1fr);
	grid-template-rows: 48px 802px;
	grid-column-gap: 0px;
	grid-row-gap: 0px;

	width: 1850px;
	height: 850px;

	/* width: 95%;
	height: 95%; */
	
	background-color: ${colors.backgroundWindow};
	clip-path: ${effects.pixelateBorder};
`