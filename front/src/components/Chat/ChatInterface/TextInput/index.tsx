import { ChangeEvent, Dispatch, FocusEvent, FormEvent, SetStateAction, useContext, useState } from "react"
// import axios from "axios"

import { Input, Style } from "./style"

import ErrorRequest from "../../../../componentsLibrary/ErrorRequest"

import InteractionContext from "../../../../contexts/InteractionContext"

import { ChannelData } from "../../../../utils/types"
import { messageStatus } from "../../../../utils/status"

type PropsTextInput = {
	setChannel: Dispatch<SetStateAction<ChannelData>>
}

function TextInput({ setChannel }: PropsTextInput) {

	const [errorRequest, setErrorRequest] = useState<boolean>(false)
	const [message, setMessage] = useState<string>('')

	const { userAuthenticate } = useContext(InteractionContext)!

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {

		event.preventDefault()
		if (message === '')
			return
		try {

			/* ============ Temporaire ============== */

			// await axios.post(`http://localhost:3333/channel/${channelTarget.id}/messages`, {
			// 	sender: userAuthenticate,
			// 	type: messageStatus.TEXT,
			// 	content: message
			// })

			// if ()
			setChannel((prevState) => ({
				...prevState,
				messages: [
					...prevState.messages,
					{
						id: -1,
						sender: userAuthenticate,
						type: messageStatus.TEXT,
						content: message
					}
				]
			}))

			setMessage('')

			/* ====================================== */

		}
		catch (error) {
			setErrorRequest(true)
		}
	}

	function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
		setMessage(event.target.value)
	}

	function removePlaceHolder(event: FocusEvent<HTMLInputElement>) {
		event.target.placeholder = ""
	}

	function setPlaceHolder(event: FocusEvent<HTMLInputElement>) {
		if (event.target.placeholder === "")
			event.target.placeholder = "Type here..."
	}

	return (
		<Style
			onSubmit={handleSubmit}
			autoComplete="off"
			spellCheck="false">
			{
				!errorRequest ?
					<Input
						onFocus={removePlaceHolder}
						onBlur={setPlaceHolder}
						onChange={handleInputChange}
						value={message}
						placeholder="Type here..." />
					:
					<ErrorRequest />
			}
		</Style>
	)
}

export default TextInput