import {
	Dispatch,
	SetStateAction
} from "react"

import {
	ArrowButton,
	ImageButton,
	InputText,
	Style
} from "./style"

import ArrowIcon from "../../../assets/down_arrow.png"

type PropsInputSearchBar = {
	value: string,
	setValue: Dispatch<SetStateAction<string>>,
	displaySearchBarResults: Dispatch<SetStateAction<boolean>>,
}

function InputSearchBar({ value, setValue, displaySearchBarResults } : PropsInputSearchBar) {
	return (
		<Style onClick={() => displaySearchBarResults(true)}>
			<InputText
				onChange={(event) => setValue(event.target.value)}
				type="text"
				placeholder="Search..."
				autoComplete="off"
				spellCheck="false"
				value={value} />
			<ArrowButton>
				<ImageButton src={ArrowIcon} />
			</ArrowButton>
		</Style>
	)
}

export default InputSearchBar