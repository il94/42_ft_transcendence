import styled from "styled-components"

import colors from "../../../utils/colors"
import effects from "../../../utils/effects"

export const Style = styled.div`
	
	display: flex;
	flex-direction: column;
	align-items: center;

	position: absolute;
	top: 50%;
	left: 50%;
	z-index: 999;
	transform: translate(-50%, -50%);
	
	width: 350px;

	clip-path: ${effects.pixelateWindow};

	background-color: ${colors.popup};

`

export const QRCodeWrapper = styled.div`

	position: relative;

	width: 200px;
	height: 200px;

`

export const QRCode = styled.img`

	width: 200px;
	clip-path: ${effects.pixelateWindow};

`

export const Message = styled.p`

	margin-top: 5px;

`