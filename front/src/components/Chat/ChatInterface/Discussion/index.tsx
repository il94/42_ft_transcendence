import { useContext, useEffect } from "react"
// import axios from "axios"

import { Style } from "./style"

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
import { messageStatus } from "../../../../utils/status"

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
						channelTarget.messages.map((message, index) => (
							message.sender.id === userAuthenticate.id ?
								message.type === messageStatus.TEXT ?
									<UserText
										key={"message" + index} // a definir
										content={(message as MessageText).content}
									/>
									:
									<UserInvitation
										key={"message" + index} // a definir
										target={(message as MessageInvitation).target}
										initialStatus={(message as MessageInvitation).status}
										idMsg={(message as MessageInvitation).id}
										idChan={(channelTarget.id)}
									/>
								:

								message.type === messageStatus.TEXT ?
									<ContactText
										key={"message" + index} // a definir
										sender={message.sender}
										content={(message as MessageText).content}
									/>
									:
									// (message as MessageInvitation).target.id === userAuthenticate.id ?
										<ContactInvitation
											key={"message" + index} // a definir
											sender={message.sender}
											target={(message as MessageInvitation).target}
											initialStatus={(message as MessageInvitation).status}
											idMsg={(message as MessageInvitation).id}
											idChan={(channelTarget.id)}
										/>
									// :
									// 	<OtherInvitation
									// 		key={"message" + index} // a definir
									// 		sender={message.sender}
									// 		target={(message as MessageInvitation).target}
									// 		initialStatus={(message as MessageInvitation).status}
									// 	/>
						))
					}
					<div style={{ marginTop: "3px" }} />
				</ScrollBar>
			}
		</Style>
	)
}

export default Discussion