import styled from "styled-components"
import colors from "../../../utils/colors"

export const Style = styled.div`

	display: flex;
	flex-direction: column;

	width: 128px;
	height: 100%;

	background-color: ${colors.channelList};

`

export const ChannelCreateButton = styled.button`
	
	display: flex;
	justify-content: center;
	align-items: center;

	width: 100%;
	height: 30px;
	min-height: 30px;

	padding: 0;

	background-color: ${colors.channelCreateButton};

	&:hover {
		background-color: ${colors.sectionHover};
	}

`