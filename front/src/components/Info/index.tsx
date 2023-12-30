import { Dispatch, SetStateAction } from "react"
import styled from "styled-components"
import SearchBar from "../SearchBar"
import colors from "../../utils/colors"

export const Style = styled.div`

	display: flex;
	justify-content: center;
	align-items: center;

	width: 100%;
	height: 53px;
	min-height: 53px;

	background-color: ${colors.navbar};

`

type PropsInfo = {
	displayChat: Dispatch<SetStateAction<boolean>>
}

function Info({ displayChat }: PropsInfo) {
	return (
		<Style>
			<SearchBar
				displayChat={displayChat} />
		</Style>
	)
}

export default Info