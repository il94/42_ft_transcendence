import styled from 'styled-components'
import { Link } from 'react-router-dom'
import colors from '../../utils/colors'
import effects from '../../utils/effects'

export const HomePage = styled.div`

	display: flex;
	flex-direction: column;
	align-items: center;

	position: relative;

	width: 100%;
	height: 100%;

`

export const MainTitle = styled.h1`

	font-size: 80px;

	&:hover {
		transform: scale(1.015);
	}

`

export const StyledLink = styled(Link)<{ color: string }>`

	text-decoration: none;

	color: ${(props) => props.color};

`

export const CentralWindow = styled.div`

	display: flex;
	flex-direction: column;
	align-items: center;

	position: absolute;
	top: 50%;
	transform: translateY(-50%);

	width: 400px;

	padding-bottom: 5px;

	border-style: solid;
	border-width: 15px;
	border-color: ${colors.popup};
	box-shadow: 10px;

	${effects.pixelateWindow};

	background-color: ${colors.popup};

`

export const StyledTitle = styled.h2`

	width: 100%;

	font-size: 45px;

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

export const LinkButtonFix = styled(Link)<{ width: string }>`

	width: ${(props) => props.width};

	padding-top: 1px;
	padding-left: 1px;
	padding-bottom: 3px;
	padding-right: 3px;

	cursor: pointer;

	font-size: 35px;
	text-decoration: none;
	text-align: center;

	${effects.shadowButton};
	${effects.pixelateWindow};
	
	color: ${colors.text};
	background-color: ${colors.button};

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