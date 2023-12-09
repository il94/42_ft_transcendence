import styled from "styled-components"
import colors from "../../../utils/colors"

export const Style = styled.div`

	display: flex;
	justify-content: flex-end;
	align-items: center;

	width: 245px;

	background-color: ${colors.chatBanner};

`

export const ChannelName = styled.p`

	margin-left: auto;

	transform: translate(15%);

	text-align: center;

`

export const ButtonsWrapper = styled.div`

	display: flex;
	flex-direction: row-reverse;
	justify-content: space-between;

	min-width: 51px;

	margin-right: 6.5px;
	margin-left: auto;

`