import { useContext, useEffect, useState } from "react"
// import axios from "axios"

import { Style } from "./style"

import ContactText from "./ContactText"
import UserText from "./UserText"
import ScrollBar from "../../../../componentsLibrary/ScrollBar"
import ContactInvitation from "./ContactInvitation"
import UserInvitation from "./UserInvitation"
import Error from "../../../../componentsLibrary/ErrorRequest"

import ChatContext from "../../../../contexts/ChatContext"
import GlobalContext from "../../../../contexts/GlobalContext"

import { ChannelData, MessageInvitation, MessageText, User } from "../../../../utils/types"
import { challengeStatus, messageStatus, userStatus } from "../../../../utils/status"

import DefaultBlueAvatar from "../../../../assets/default_blue.png"

type PropsDiscussion = {
	channelTarget: ChannelData
}

function Discussion({ /* channelTarget */ }: PropsDiscussion) {

	const [messages, setMessages] = useState<(MessageText | MessageInvitation)[] | undefined>(undefined)

	const { userAuthenticate } = useContext(GlobalContext)!

	useEffect(() => {
		async function fetchData() {
			try {

				/* ============ Temporaire ============== */

				// const response = await axios.get("http://localhost:3333/channel/${channelTarget.id}/messages")
				// setMessages(response)

				const userTest: User = {
					id: 5,
					username: "Someone",
					avatar: DefaultBlueAvatar,
					status: userStatus.ONLINE,
					scoreResume: {
						wins: 0,
						draws: 0,
						looses: 0
					}
				}

				setMessages([
					{
						id: 0,
						sender: userAuthenticate,
						type: messageStatus.TEXT,
						content: "Contact message"
					},
					{
						id: 1,
						sender: userTest,
						type: messageStatus.TEXT,
						content: "User message"
					},
					{
						id: 2,
						sender: userAuthenticate,
						type: messageStatus.INVITATION,
						target: userTest,
						status: challengeStatus.PENDING
					},
					{
						id: 3,
						sender: userAuthenticate,
						type: messageStatus.INVITATION,
						target: userTest,
						status: challengeStatus.ACCEPTED
					},
					{
						id: 4,
						sender: userAuthenticate,
						type: messageStatus.INVITATION,
						target: userTest,
						status: challengeStatus.CANCELLED
					},
					{
						id: 5,
						sender: userAuthenticate,
						type: messageStatus.INVITATION,
						target: userTest,
						status: challengeStatus.IN_PROGRESS
					},
					{
						id: 6,
						sender: userAuthenticate,
						type: messageStatus.INVITATION,
						target: userTest,
						status: challengeStatus.FINISHED
					},
					{
						id: 7,
						sender: userTest,
						type: messageStatus.INVITATION,
						target: userAuthenticate,
						status: challengeStatus.PENDING
					},
					{
						id: 8,
						sender: userTest,
						type: messageStatus.INVITATION,
						target: userAuthenticate,
						status: challengeStatus.ACCEPTED
					},
					{
						id: 9,
						sender: userTest,
						type: messageStatus.INVITATION,
						target: userAuthenticate,
						status: challengeStatus.CANCELLED
					},
					{
						id: 10,
						sender: userTest,
						type: messageStatus.INVITATION,
						target: userAuthenticate,
						status: challengeStatus.IN_PROGRESS
					},
					{
						id: 11,
						sender: userTest,
						type: messageStatus.INVITATION,
						target: userAuthenticate,
						status: challengeStatus.FINISHED
					}
				]
				)

				/* ============================================== */

			}
			catch (error) {
				setMessages(undefined)
			}
		}
		fetchData()
	}, [])

	const { chatScrollValue, setChatScrollValue, chatRender, setChatRender } = useContext(ChatContext)!


	return (
		<Style>
			{
				messages ?
					<ScrollBar
						state={{
							value: chatScrollValue,
							setter: setChatScrollValue
						}}
						firstRenderState={{
							value: chatRender,
							setter: setChatRender
						}}
					>
						{
							messages.map((message, index) => (
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
											status={(message as MessageInvitation).status}
										/>
									:
									message.type === messageStatus.TEXT ?
										<ContactText
											key={"message" + index} // a definir
											sender={message.sender}
											content={(message as MessageText).content}
										/>
										:
										<ContactInvitation
											key={"message" + index} // a definir
											sender={message.sender}
											target={(message as MessageInvitation).target}
											status={(message as MessageInvitation).status}
										/>
							))
						}
						<div style={{ marginTop: "3px" }} />
					</ScrollBar>
					:
					<Error />
			}
		</Style>
	)
}

export default Discussion