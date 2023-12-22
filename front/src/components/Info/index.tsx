import { Dispatch, SetStateAction } from "react"
import styled from "styled-components"
import SearchBar from "../SearchBar"
import { chatWindowStatus } from "../../utils/status"
import colors from "../../utils/colors"

export const Style = styled.div`

	display: flex;
	justify-content: center;
	align-items: center;

	width: 100%;
	height: 53px;
	min-height: 53px;

	background-color: ${colors.profile};

`

type PropsInfo = {
	setChatWindowState: Dispatch<SetStateAction<chatWindowStatus>>,
	displayChat: Dispatch<SetStateAction<boolean>>
}

function Info({ setChatWindowState, displayChat }: PropsInfo) {
	return (
		<Style>
			<SearchBar
				setChatWindowState={setChatWindowState}
				displayChat={displayChat} />
		</Style>
	)
}

export default Info