import styled from "styled-components"
import colors from "../../../../utils/colors"

export const Style = styled.div`

	display: flex;
	justify-content: space-between;
	align-items: center;

	width: 100%;
	height: 30px;
	min-height: 30px;

	background-color: ${colors.chatBanner};

`

export const RoomName = styled.p`

	width: 100%;

	text-align: center;

`

export const ReduceButton = styled.div`

	margin-right: 6.5px;

`