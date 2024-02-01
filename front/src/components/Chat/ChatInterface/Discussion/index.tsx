import {
	useContext
} from "react"

import {
	Style
} from "./style"

import ContactText from "./ContactText"
import UserText from "./UserText"
import ScrollBar from "../../../../componentsLibrary/ScrollBar"
import ContactInvitation from "./ContactInvitation"
import UserInvitation from "./UserInvitation"

import ChatContext from "../../../../contexts/ChatContext"
import InteractionContext from "../../../../contexts/InteractionContext"

import {
	MessageInvitation,
	MessageText
} from "../../../../utils/types"

import {
	messageType
} from "../../../../utils/status"

function Discussion() {

	const { userAuthenticate, channelTarget } = useContext(InteractionContext)!
	const { chatRender, setChatRender } = useContext(ChatContext)!

	return (
		<Style>
			{
				<ScrollBar
					firstRenderState={{
						value: chatRender,
						setter: setChatRender
					}}
					activeState>
					{
						// Mappage des messages
						channelTarget?.messages.map((message, index) => (

							// Si l'auteur du message est le user auth
							message.sender.id === userAuthenticate.id ?

								// Si le message est un message textuel
								message.type === messageType.TEXT ?
									<UserText
										key={"message" + index} // a definir
										content={(message as MessageText).content}
									/>

									// Si le message est une invitation
									:
									<UserInvitation
										key={"message" + index} // a definir
										target={(message as MessageInvitation).target}
										initialStatus={(message as MessageInvitation).status}
										idMsg={(message as MessageInvitation).id}
										idChan={(channelTarget.id)}
									/>

								// Si l'auteur du message n'est pas le user auth
								:

								// Si le message est un message textuel
								message.type === messageType.TEXT ?
									<ContactText
										key={"message" + index} // a definir
										sender={message.sender}
										content={(message as MessageText).content}
									/>

									// Si le message est une invitation
									:
									<ContactInvitation
										key={"message" + index} // a definir
										sender={message.sender}
										target={(message as MessageInvitation).target}
										initialStatus={(message as MessageInvitation).status}
										idMsg={(message as MessageInvitation).id}
										idChan={(channelTarget.id)}
									/>
						))
					}
					<div style={{ marginTop: "3px" }} />
				</ScrollBar>
			}
		</Style>
	)
}

export default Discussion