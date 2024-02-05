import {
	Dispatch,
	SetStateAction,
	useState
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

	const [placeHolder, setPlaceHolder] = useState<string>("Search...")

	return (
		<Style
			onClick={() => displaySearchBarResults(true)}
			onBlur={() => setPlaceHolder("Search...")}>
			<InputText
				onChange={(event) => setValue(event.target.value)}
				onClick={() => setPlaceHolder('')}
				type="text"
				placeholder={placeHolder}
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