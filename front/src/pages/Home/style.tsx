import styled from 'styled-components'
import { Link } from 'react-router-dom'
import colors from '../../utils/colors'
import effects from '../../utils/effects'

export const HomerWapper = styled.div`

	display: flex;
	flex-direction: column;
	align-items: center;

`

export const WelcomeWindow = styled.div`

	display: flex;
	flex-direction: column;
	align-items: center;

	font-size: 10%;
	width: 400px;
	margin-top: 25vh;
	margin-bottom: 25vh;
	background-color: ${colors.popup};

	border-style: solid;
	border-width: 15px;
	border-color: ${colors.popup};
	box-shadow: 10px;

	${effects.pixelateWindow};

`

export const StyledMainTitle = styled.h1`

	font-size: 80px;

	cursor: default;
	user-select: none;

	&:hover {
		transform: scale(1.015);
	}

`

export const StyledTitle = styled.h2`

	margin: 10px;

	font-size: 45px;

	cursor: default;
	user-select: none;

	&:hover {
		transform: scale(1.015);
	}

`

export const StyledLink = styled(Link)`

	font-size: 40px;
	margin: 10px;
	padding: 1px;
	padding-bottom: 3px;
	padding-right: 3px;

	background-color: ${colors.button};
	color: ${colors.text};

	cursor: pointer;

	text-decoration: none;
	${effects.shadowButton};

	${effects.pixelateWindow};
	
	&:hover {
		transform: scale(1.015);
	}
	&:active {
		transform: scale(0.95);
		transform: translate(2px, 2px);
		background-color: ${colors.shadowButton};
		border-color: ${colors.shadowButton};
	}

`