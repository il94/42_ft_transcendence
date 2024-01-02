import styled from "styled-components"

import InputSearchBar from "./InputSearchBar"
import ResultsSearchBar from "./ResultsSearchBar"
import { Dispatch, SetStateAction, useState } from "react"

const Style = styled.div`

	display: flex;
	flex-direction: column;

	position: absolute;
	top: 7.5px;
	z-index: 999;

	width: 90%;
	height: 326px;

`

type PropsSearchBar = {
	searchBarResults: boolean,
	displaySearchBarResults: Dispatch<SetStateAction<boolean>>,
	displayChat: Dispatch<SetStateAction<boolean>>
}

function SearchBar({ searchBarResults, displaySearchBarResults, displayChat } : PropsSearchBar) {

	const [value, setValue] = useState<string>('')

	return (
		<Style>
			<InputSearchBar
				value={value}
				setValue={setValue}
				displaySearchBarResults={displaySearchBarResults} />
				{
					searchBarResults &&
					<ResultsSearchBar displayChat={displayChat} />
				}
		</Style>
	)
}

export default SearchBar