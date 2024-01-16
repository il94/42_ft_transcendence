import { ChangeEvent, Dispatch, FocusEvent, FormEvent, SetStateAction, useContext, useEffect, useState } from "react"
import axios from "axios"

import { Input, Style } from "./style"

import ErrorRequest from "../../../../componentsLibrary/ErrorRequest"

import InteractionContext from "../../../../contexts/InteractionContext"



import { Channel, User } from "../../../../utils/types"
import { Socket } from "socket.io-client"
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

	function findUserInChannels(channel: any, userId: number): User | undefined {
		// Combinez les tableaux d'utilisateurs en un seul tableau
		const allUsers = channel.members.concat(channel.owner, channel.administrators);
	  
		// Recherchez l'utilisateur par son ID
		const foundUser = allUsers.find((user: User) => user.id === userId);
	  
		return foundUser;
	  }

	function printMsg(msg: string, idSend: number, idChannel:number){
		const userSend = findUserInChannels(channel, idSend);
		if (idChannel == channel.id)
			{
			setChannel((prevState: { messages: any }) => ({
				...prevState,
				messages: [
				...prevState.messages,
				{
					id: idSend,
					sender: userSend,
					type: messageStatus.TEXT,
					content: msg
				}
				]
			}));
			};
			
		};

		async function messagelog(){
			const response = await axios.get(`http://localhost:3333/channel/${channel.id}/message`, {
			headers: {
					'Authorization': `Bearer ${token}`
				}
			})
			//console.log(response);
		}

		useEffect(() => {
		messagelog();
		userAuthenticate.socket.on("printMessage", printMsg);

		return () => {
			userAuthenticate.socket.off("printMessage", printMsg);
				};
		 }, [channel]);


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
				await axios.post(`http://localhost:3333/channel/${channel.id}/message`, 
				{ msg: message },
					{
						headers: {
							'Authorization': `Bearer ${token}`
						}
					}
				);
				userAuthenticate.socket.emit("sendMessage", response.data, message, userAuthenticate.id, channel.id);
				
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