import styled from "styled-components"
import SearchBar from "../SearchBar"
import { Dispatch, SetStateAction } from "react"
import { chatWindowStatus } from "../../utils/status"

export const Style = styled.div`

	display: flex;
	justify-content: center;
	align-items: center;

	width: 100%;
	height: 53px;
	min-height: 53px;

	background-color: #B197FA;

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