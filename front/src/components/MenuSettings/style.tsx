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

	display: flex;
	flex-direction: column;

	position: absolute;
	top: 50%;
	left: 50%;
	z-index: 998;
	transform: translate(-50%, -50%);

	width: 350px;

	${effects.pixelateWindow};

	background-color: ${colors.module};

`

export const ButtonWrapper = styled.div`

	display: flex;
	justify-content: flex-end;
	align-items: center;

	width: 100%;
	height: 15px;

`

export const CloseButton = styled.div`

	margin-top: 18px;
	margin-right: 6.5px;

`

export const Setting = styled.div`

	display: flex;
	justify-content: space-between;
	align-items: center;

	width: 100%;

	margin-bottom: 15px;

`

export const SettingInfo = styled.div`

	display: flex;
	flex-direction: column;

	margin-left: 15px;

`

export const SettingTtile = styled.div`

	font-weight: bold;
	font-size: 15px;

`


export const ProfilePicture = styled.div`

	width: 92px;
	height: 92px;
	min-width: 92px;
	min-height: 92px;

	margin-left: 15px;
	border: 10px solid ${colors.rankNull};

	border-radius: 50%;

	background-color: ${colors.profilePicture};

`

export const UserName = styled.p`

	font-size: 16px;

`

export const TwoFA = styled.p`

	font-size: 16px;

`

export const Button = styled.button`

	/* min-width: 62px; */
	height: 50px;

	margin-right: 15px;

	background-color: ${colors.button};
	color: ${colors.text};

	cursor: pointer;

	text-decoration: none;
	${effects.shadowButton};

	${effects.pixelateWindow};

	&:active {
		transform: scale(0.95);
		transform: translate(2px, 2px);
		background-color: ${colors.shadowButton};
		border-color: ${colors.shadowButton};
	}


`