import { styled } from 'styled-components'

import colors from '../../utils/colors'
import effects from '../../utils/effects'

export const GamePage = styled.div`

	display: flex;
	justify-content: center;
	align-items: center;

	width: 100%;
	height: 100%;
	min-height: 212px;

	background-color: ${colors.background}; 

`

export const BigGameWrapper = styled.div`

	display: flex;
	justify-content: center;
	align-items: center;
	
	width: 95%;
	height: 95%;
	/* min-width: à définir par rapport au Pong */
	min-height: 212px;

	${effects.pixelateWindow};

`

export const LeftWrapper = styled.div`

	display: flex;
	flex-direction: column;

	width: 240px;
	min-width: 240px;
	height: 100%;

`

export const RightWrapper = styled.div<{ $smallScreen?: boolean}>`

	display: flex;
	flex-direction: column;

	width: calc(100% - 240px);
	height: 100%;

	${props => props.$smallScreen && effects.pixelateWindow}

`

export const LittleGameWrapper = styled.div`

	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	
	width: 95%;
	height: 95%;
	/* min-width: à définir par rapport au Pong */
	min-height: 212px;

	${effects.pixelateWindow};

`

export const TopGameWrapper = styled.div`
	
	display: flex;

	width: 100%;
	height: 53px;
	/* min-width: à définir par rapport au Pong */
	min-height: 53px;

`

export const BottomGameWrapper = styled.div`
	
	display: flex;

	width: 100%;
	height: calc(100% - 53px);
	/* min-width: à définir par rapport au Pong */
	min-height: 159px;

`

export const Icon = styled.img`

	width: 37px;
	width: 39.78%;

	cursor: pointer;

	${effects.pixelateIcon};
	${effects.shadowButton};


	border-width: 0.2em; // a definir
	/* border-width: 2.5px; */

`