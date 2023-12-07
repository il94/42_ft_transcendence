import styled from "styled-components"
import colors from "../../utils/colors"
import effects from "../../utils/effects"

export const PseudoStyle = styled.div`

	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.1);
	
`

export const Style = styled.div`

	position: relative;
	top: 50%;
	left: 50%;
	z-index: 998;
	transform: translate(-50%, -50%);

	width: 350px;

	padding-bottom: 15px;

	clip-path: ${effects.pixelateWindow};

	background-color: ${colors.module};

`

export const CloseButtonWrapper = styled.div`

	display: flex;
	justify-content: flex-end;
	align-items: center;

	height: 30.5px;

	padding-right: 6.5px;

`

export const CloseButton = styled.div`

	position: absolute;
	top: 6.5px;
	right: 6.5px;

`

export const SettingsForm = styled.form`

	display: flex;
	flex-direction: column;

	margin-left: 15px;
	margin-right: 15px;

`

export const Setting = styled.div`

	display: flex;
	flex-direction: column;

	width: 100%;

`

export const SettingTtile = styled.div`

	font-weight: bold;
	font-size: 15px;

`

export const ErrorMessage = styled.p`
	
	display: flex;
	justify-content: center;
	align-items: center;

	width: 100%;
	height: 20px;

	text-align: center;
	font-size: 10px;

	color: ${colors.textError};

`

export const TwoFAValue = styled.p<{ $error: boolean }>`

	border-bottom: 1px solid ${(props) => props.$error && colors.textError };
	text-align: center;

	background-color: inherit;

`