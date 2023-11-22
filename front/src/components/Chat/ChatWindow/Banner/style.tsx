import styled from "styled-components"
import colors from "../../../../utils/colors"
import effects from "../../../../utils/effects"

export const Style = styled.div`

	display: flex;
	justify-content: space-between;
	align-items: center;

	width: 100%;
	height: 30px;
	min-height: 30px;

	background-color: ${colors.chatBanner};

`

export const ChannelName = styled.p`

	width: 100%;

	text-align: center;

`

export const ReduceButton = styled.img`

	width: 18.11px;
	height: 18.11px;

	margin-right: 6.5px;

	cursor: pointer;

	${effects.pixelateIcon};
	${effects.shadowButton};


	border-width: 0.2em; // a definir
	/* border-width: 2.5px; */

`