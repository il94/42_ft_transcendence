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

export const LeftGameWrapper = styled.div<{ $social: boolean }>`

	display: flex;
	flex-direction: column;

	width: ${(props) => props.$social ? 58 : 250}px;
	min-width: ${(props) => props.$social ? 58 : 250}px;
	height: 100%;

`

export const RightGameWrapper = styled.div`

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
	
	position: relative;

	width: 100%;
	height: calc(100% - 53px);
	/* min-width: à définir par rapport au Pong */
	min-height: 159px;

`