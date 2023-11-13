import React from "react"
import { Style } from "./style"

function TextInput() {

	function removePlaceHolder(event: React.FocusEvent<HTMLInputElement>) {
		event.target.placeholder = ""
	}

	function setPlaceHolder(event: React.FocusEvent<HTMLInputElement>) {
		if (event.target.placeholder === "")
			event.target.placeholder = "Type here..."
	}

	return (
		<Style	onFocus={removePlaceHolder}
				onBlur={setPlaceHolder}
				placeholder="Type here..." />
	)
}

export default TextInput