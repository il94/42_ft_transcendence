import {
	ChangeEvent,
	FocusEvent,
	FormEvent,
	useContext,
	useState
} from "react"
import axios from "axios"

import { Input, Style } from "./style"

import ErrorRequest from "../../../../componentsLibrary/ErrorRequest"

import InteractionContext from "../../../../contexts/InteractionContext"
import AuthContext from "../../../../contexts/AuthContext"

import { Channel } from "../../../../utils/types"
import { messageStatus } from "../../../../utils/status"

type PropsTextInput = {
	channel: Channel,
}
 

function TextInput({ channel }: PropsTextInput) {
	const { token, url } = useContext(AuthContext)!
	const [errorRequest, setErrorRequest] = useState<boolean>(false)
	const [message, setMessage] = useState<string>('')
	const { userAuthenticate } = useContext(InteractionContext)!

	/*

		response = tableau des socket des users connecter sur le channel

	*/


	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()
		if (message === '')
			return
			try {

				const sockets = await axios.get(`http://${url}:3333/channel/${channel.id}/sockets`, {
				headers: {
						'Authorization': `Bearer ${token}`
					}
				})

				/* post le meesage dans le back */
				await axios.post(`http://${url}:3333/channel/${channel.id}/message`, 
				{ msg: message , msgStatus : messageStatus.TEXT},
					{
						headers: {
							'Authorization': `Bearer ${token}`
						}
					}
				);
				userAuthenticate.socket?.emit("sendDiscussion", sockets.data, userAuthenticate.id, channel.id, message);
				
				setMessage("");
			  } catch (error) {
				console.log(error);
				setErrorRequest(true);
			  }
			};

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