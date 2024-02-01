import {
	ChangeEvent,
	FocusEvent,
	FormEvent,
	useContext,
	useState
} from "react"
import axios from "axios"

import {
	Input,
	Style
} from "./style"

import InteractionContext from "../../../../contexts/InteractionContext"
import AuthContext from "../../../../contexts/AuthContext"

import { Channel } from "../../../../utils/types"
import { messageType } from "../../../../utils/status"


type PropsTextInput = {
	channel: Channel,
}

 
function TextInput() {

	const { token, url } = useContext(AuthContext)!
	const [message, setMessage] = useState<string>('')
	const { userAuthenticate, channelTarget } = useContext(InteractionContext)!

	/*
		response = tableau des socket des users connecter sur le channel
	*/


	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()
		if (message === '')
			return
			try {
				if (new Date(channel.muteInfo[userAuthenticate.id]) > new Date())
				{
					console.log("you are muted");
					// voir comment gerer le mute coter front
					return;
				}
				const sockets = await axios.get(`http://${url}:3333/channel/${channelTarget.id}/sockets`, {

				headers: {
						'Authorization': `Bearer ${token}`
					} 
				})

				/* post le meesage dans le back */
				const idMsg = await axios.post(`http://${url}:3333/channel/${channelTarget.id}/message`, 
				{ msg: message , msgStatus : messageType.TEXT},
					{
						headers: {
							'Authorization': `Bearer ${token}`
						}
					}
				);
				userAuthenticate.socket?.emit("sendDiscussion", sockets.data, userAuthenticate.id, channelTarget.id, message, idMsg.data);
				
				setMessage("");
			  } catch (error) {
				console.log(error);
				// setErrorRequest(true);
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
					<Input
						onFocus={removePlaceHolder}
						onBlur={setPlaceHolder}
						onChange={handleInputChange}
						value={message}
						placeholder="Type here..." />
		</Style>
	)
}

export default TextInput