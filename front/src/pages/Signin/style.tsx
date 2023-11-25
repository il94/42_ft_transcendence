import styled from 'styled-components'
import { Link } from 'react-router-dom'
import colors from '../../utils/colors'
import effects from '../../utils/effects'

export const SigninPage = styled.div`

	display: flex;
	flex-direction: column;
	align-items: center;

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

export const SigninForm = styled.form`

	display: flex;
	flex-direction: column;
	align-items: center;

	width: 231px;

	margin-top: 20px;
	margin-bottom: 20px;

`

export const Label = styled.label`

	display: flex;
	flex-direction: column;
	align-items: center;

	width: 100%;
	height: 75px;

	font-size: 20px;

`

export const TextInput = styled.input`

	width: 100%;

	border: none;
	border-bottom: 1px solid ${colors.text};

	font-size: 25px;
	text-align: center;

	color: ${colors.text};
	background-color: ${colors.popup};

	&:focus {
		outline: none;
		border-color: ${colors.hoverBorderText};
	}

`

export const Button = styled.button`

	padding-top: 1px;
	padding-left: 11px;
	padding-bottom: 3px;
	padding-right: 13px;

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

export const Separator = styled.div`
	
	display: flex;
	justify-content: space-evenly;
	align-items: center;

	width: 231px;
	height: 50px;

`

export const Line = styled.div`

	width: 100%;

	border-bottom: 0.5px solid ${colors.text};

`

export const TextSeparator = styled.p`

	padding-left: 15px;
	padding-right: 15px;

`


export const FTRedirectWrapper = styled.div`

	display: flex;
	align-items: center;

	text-align: center;

`

export const ButtonImage = styled.button`

	display: flex;
	align-items: center;

	padding-top: 1px;
	padding-bottom: 3px;
	padding-right: 13px;

	cursor: pointer;

	font-size: 16px;
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

export const Image = styled.img`

	padding-right: 7px;

`