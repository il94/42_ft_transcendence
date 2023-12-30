import { Dispatch, SetStateAction } from "react"
import styled from "styled-components"
import SearchBar from "../SearchBar"
import colors from "../../utils/colors"

export const Style = styled.div`

	display: flex;
	justify-content: center;
	align-items: center;

	position: relative;

	width: 100%;
	height: 53px;
	min-height: 53px;

	background-color: ${colors.navbar};

`

type PropsSearchBarWrapper = {
	searchBarResults: boolean,
	displaySearchBarResults: Dispatch<SetStateAction<boolean>>,
	displayChat: Dispatch<SetStateAction<boolean>>
}

function SearchBarWrapper({ searchBarResults, displaySearchBarResults, displayChat }: PropsSearchBarWrapper) {
	return (
		<Style>
			<SearchBar 
				searchBarResults={searchBarResults}
				displaySearchBarResults={displaySearchBarResults}
				displayChat={displayChat} />
		</Style>
	)
}

export default SearchBarWrapper