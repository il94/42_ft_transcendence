import styled from "styled-components"
import colors from "../../../utils/colors"

export const Style = styled.div`

	display: flex;
	justify-content: flex-end;
	align-items: center;

	width: 245px;

	background-color: ${colors.chatBanner};

`

export const LeaveButtonWrapper = styled.div`

	display: flex;

	margin-left: 2.5px;
`

export const ChannelName = styled.p`

	margin-left: auto;
	margin-right: auto;

	width: 111px;

	transform: translate(15%);

	text-align: center;

`

export const ButtonsWrapper = styled.div`

	display: flex;
	justify-content: space-between;

	min-width: 51px;
	width: 51px;

	margin-right: 6.5px;
	margin-left: auto;

`