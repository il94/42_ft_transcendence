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

export const GameWrapper = styled.div`

	display: flex;
	justify-content: center;
	
	width: 95%;
	height: 95%;
	/* min-width: à définir par rapport au Pong */
	min-height: 212px;

	${effects.pixelateWindow};

`

export const LeftGameWrapper = styled.div`

	display: flex;
	flex-direction: column;

	width: 240px;
	min-width: 240px;
	height: 100%;

`

export const ReduceLeftGameWrapper = styled.div`

	display: flex;
	flex-direction: column;

	width: 58px;
	min-width: 58px;
	height: 100%;

`

export const RightGameWrapper = styled.div`

	display: flex;
	flex-direction: column;

	width: 100%;
	/* min-width: à définir par rapport au Pong */
	height: 100%;

`

export const ExtendRightGameWrapper = styled.div`

	display: flex;
	flex-direction: column;

	width: 100%;
	/* min-width: à définir par rapport au Pong */
	height: 100%;

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
