import styled from "styled-components"
import SearchBar from "../SearchBar"

export const Style = styled.div`

	display: flex;
	justify-content: center;
	align-items: center;

	width: 100%;
	height: 53px;
	min-height: 53px;

	background-color: #B197FA;

`

function Info() {
	return (
		<Style>
			<SearchBar />
		</Style>
	)
}

export default Info