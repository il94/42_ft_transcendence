import styled from 'styled-components'
import colors from '../../utils/colors'
import effects from '../../utils/effects'

export const SignupPage = styled.div`

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

export const StyledTitle = styled.p`

	width: 100%;

	font-size: 45px;
	font-weight: bold;

	text-align: center;

	&:hover {
		transform: scale(1.015);
	}

`

export const SettingsForm = styled.form`

	display: flex;
	flex-direction: column;
	align-items: center;

	width: 100%;

	margin-top: 20px;
	margin-bottom: 20px;

`

export const Setting = styled.div`

	display: flex;
	flex-direction: column;
	align-items: center;

	width: 100%;

	font-size: 20px;

`

export const ErrorMessage = styled.div`

	display: flex;
	justify-content: center;
	align-items: center;

	width: 100%;
	height: 15px;
	min-height: 15px;

	font-size: 12px;
	text-align: center;

	color: ${colors.textError};

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