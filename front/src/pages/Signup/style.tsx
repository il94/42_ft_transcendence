import styled from 'styled-components'
import colors from '../../utils/colors'
import effects from '../../utils/effects'

export const SignupPage = styled.div`

	display: flex;
	flex-direction: column;
	align-items: center;

	position: relative;

	width: 100%;
	height: 100%;

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

	position: absolute;
	top: 50%;
	transform: translateY(-50%);

	width: 400px;

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

	text-align: center;

	&:hover {
		transform: scale(1.015);
	}

`

export const SignupForm = styled.form`

	display: flex;
	flex-direction: column;
	align-items: center;

	width: 100%;

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

	width: 231px;

	border: none;
	border-bottom: 1px solid;

	font-size: 25px;
	text-align: center;

	background-color: inherit;

	&:focus {
		outline: none;
		border-color: ${colors.focusBorderText};
	}

`

export const ErrorMessage = styled.div`

	display: flex;
	align-items: center;
	justify-content: center;

	width: 100%;
	height: 15px;
	min-height: 15px;

	font-size: 12px;
	text-align: center;

	color: #c70505;

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

	border-bottom: 0.5px solid;

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