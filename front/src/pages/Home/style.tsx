import styled from 'styled-components'
import colors from '../../utils/colors'
import effects from '../../utils/effects'

export const HomePage = styled.div`

	display: flex;
	flex-direction: column;
	align-items: center;

	min-height: 100%;

	background-color: ${colors.background}; 

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

	width: 400px;

	margin-top: auto;
	margin-bottom: auto;
	padding-bottom: 5px;

	border-style: solid;
	border-width: 15px;
	border-color: ${colors.popup};
	box-shadow: 10px;

	clip-path: ${effects.pixelateWindow};

	background-color: ${colors.popup};

`

export const StyledTitle = styled.h2`

	width: 100%;

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

	margin-top: 20px;

`