import { FocusEvent } from "react"
import { Style } from "./style"

function TextInput() {

	function removePlaceHolder(event: FocusEvent<HTMLInputElement>) {
		event.target.placeholder = ""
	}

	function setPlaceHolder(event: FocusEvent<HTMLInputElement>) {
		if (event.target.placeholder === "")
			event.target.placeholder = "Type here..."
	}

	return (
		<Style
			onFocus={removePlaceHolder}
			onBlur={setPlaceHolder}
			placeholder="Type here..." />
	)
}

export default TextInput