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

// export const SettingsRow = styled.div`

// 	display: flex;
// 	justify-content: center;
// 	align-items: center;

// 	width: 100%;
// 	min-height: 70px;

// `

export const Setting = styled.div`

	display: flex;
	flex-direction: column;
	/* justify-content: center; */

	width: 100%;
	/* min-height: 70px; */

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

	/* margin-top: 5px; */

	text-align: center;
	font-size: 10px;

	color: red;

`

export const TwoFAValue = styled.p`

	border-bottom: 1px solid;
	text-align: center;

	background-color: inherit;

`

export const Avatar = styled.img`

	width: 92px;
	height: 92px;
	min-width: 92px;
	min-height: 92px;

	/* margin-left: 15px; */
	border: 10px solid ${colors.rankNull};

	border-radius: 50%;

`
