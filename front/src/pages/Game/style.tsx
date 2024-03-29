import styled from 'styled-components'

import effects from '../../utils/effects'

export const GamePage = styled.div`

	display: flex;
	justify-content: center;
	align-items: center;

	width: 100%;
	height: 100%;

	overflow: hidden;

`

export const GameWrapper = styled.div`

	display: flex;
	justify-content: center;
	
	width: 95%;
	height: 95%;
	min-width: 623px;
	min-height: 528px;

	clip-path: ${effects.pixelateWindow};

`

export const LeftGameWrapper = styled.div<{ $social: boolean }>`

	display: flex;
	flex-direction: column;

	width: ${(props) => props.$social ? 250 : 58}px;
	min-width: ${(props) => props.$social ? 250 : 58}px;
	height: 100%;

`

export const RightGameWrapper = styled.div`

	display: flex;
	flex-direction: column;

	width: 100%;
	min-width: 373px;
	height: 100%;

`

export const TopGameWrapper = styled.div`
	
	display: flex;

	width: inherit;
	height: 53px;
	min-width: inherit;
	min-height: 53px;

`

export const BottomGameWrapper = styled.div`
	
	position: relative;

	width: inherit;
	height: inherit;
	min-width: 373px;
	min-height: 475px;

`
