import styled from 'styled-components'
import colors from '../../utils/colors'
import effects from '../../utils/effects'

export const HomePage = styled.div`

	display: flex;
	flex-direction: column;
	align-items: center;

	min-height: 100%;

`

export const MainTitle = styled.h1`

	font-size: 80px;

	&:hover {
		transform: scale(1.015);
	}

`

export const CentralWindow = styled.div`

	display: flex;
	flex-direction: column;
	align-items: center;

	width: 420px;

	margin-top: auto;
	margin-bottom: auto;
	padding: 5px;

	clip-path: ${effects.pixelateWindow};

	background-color: ${colors.popup};

`

export const StyledTitle = styled.h2`

	width: 100%;

	padding: 10px;
	
	font-size: 45px;
	font-weight: bold;

	text-align: center;

	&:hover {
		transform: scale(1.015);
	}
`

export const ButtonsWrapper = styled.div`

	display: flex;
	justify-content: space-evenly;

	width: 100%;

	padding: 5px;
	padding-bottom: 10px;
`