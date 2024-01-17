import { ChangeEvent, Dispatch, FocusEvent, FormEvent, SetStateAction, useContext, useEffect, useState } from "react"
import axios from "axios"

import { Input, Style } from "./style"

import ErrorRequest from "../../../../componentsLibrary/ErrorRequest"

import InteractionContext from "../../../../contexts/InteractionContext"



import { Channel, MessageText, User } from "../../../../utils/types"
import { messageStatus } from "../../../../utils/status"
import AuthContext from "../../../../contexts/AuthContext"
type PropsTextInput = {
	channel: Channel,
	setChannel: Dispatch<SetStateAction<Channel>>
}
 

function TextInput({ channel,  setChannel }: PropsTextInput) {
	const { token } = useContext(AuthContext)!
	const [errorRequest, setErrorRequest] = useState<boolean>(false)
	const [message, setMessage] = useState<string>('')
	const { userAuthenticate } = useContext(InteractionContext)!

	/* 
		renvoie le user contenue dans le channel correspondant a l'id du user envoyer 
	*/

	function findUserInChannels(channel: any, userId: number): User | undefined {
		// Combinez les tableaux d'utilisateurs en un seul tableau
		const allUsers = channel.members.concat(channel.owner, channel.administrators);
	  
		// Recherchez l'utilisateur par son ID
		const foundUser = allUsers.find((user: User) => user.id === userId);
	  
		return foundUser;
	  }

	function printMsg(msg: string, idSend: number, idChannel:number) {
		const userSend = findUserInChannels(channel, idSend);
		if (idChannel == channel.id)
			{
			setChannel((prevState: Channel) => {
				return {
					...prevState,
					messages: [
						...prevState.messages,
						{
							sender: userSend,
							type: messageStatus.TEXT,
							content: msg
						} as MessageText
					]
				}
			});
			};
		};


		/* 
			active l'ecouteur d'evenement pour l'envoie du channel 
		*/
		useEffect(() => {
		userAuthenticate.socket?.on("printMessage", printMsg);

		return () => {
			userAuthenticate.socket?.off("printMessage", printMsg);
				};
		 }, [channel]);



	/*

		response = tableau des socket des users connecter sur le channel

	*/


	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()
		if (message === '')
			return
			try {

				const response = await axios.get(`http://localhost:3333/channel/${channel.id}/userId`, {
				headers: {
						'Authorization': `Bearer ${token}`
					}
				})

				/* post le meesage dans le back */
				await axios.post(`http://localhost:3333/channel/${channel.id}/message`, 
				{ msg: message , msgStatus : messageStatus.TEXT},
					{
						headers: {
							'Authorization': `Bearer ${token}`
						}
					}
				);
				userAuthenticate.socket?.emit("sendMessage", response.data, message, userAuthenticate.id, channel.id);
				
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