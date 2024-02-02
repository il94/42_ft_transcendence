import styled from "styled-components"

import colors from "../../utils/colors"
import effects from "../../utils/effects"

export const Style = styled.div<{ $zIndex: number }>`

	position: absolute;
	top: 50%;
	left: 50%;
	z-index: ${(props) => props.$zIndex};
	transform: translate(-50%, -50%);

	width: 350px;

	height: inherit;
	max-height: 636px;
	min-height: 159px;

	overflow-y: auto;

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

export const HorizontalSettingsFormTemp = styled.form`

	display: flex;
	flex-direction: column;

	margin-left: 15px;
	margin-right: 15px;

`

export const HorizontalSettingTemp = styled.div`

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

export const TwoFAValue = styled.p`

	border-bottom: 1px solid;
	text-align: center;

	background-color: inherit;

`