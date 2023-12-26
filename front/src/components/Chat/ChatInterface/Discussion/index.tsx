import { useContext, useEffect } from "react"
// import axios from "axios"

import { Style } from "./style"

import ContactText from "./ContactText"
import UserText from "./UserText"
import ScrollBar from "../../../../componentsLibrary/ScrollBar"
import ContactInvitation from "./ContactInvitation"
import UserInvitation from "./UserInvitation"

import ChatContext from "../../../../contexts/ChatContext"
import GlobalContext from "../../../../contexts/GlobalContext"

import { ChannelData, MessageInvitation, MessageText, User } from "../../../../utils/types"
import { challengeStatus, messageStatus, userStatus } from "../../../../utils/status"

import DefaultBlueAvatar from "../../../../assets/default_blue.png"

type PropsDiscussion = {
	channelTarget: ChannelData
}

function Discussion({ channelTarget }: PropsDiscussion) {

	const { userAuthenticate } = useContext(GlobalContext)!

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


	useEffect(() => {

		const randomIndex = Math.floor(Math.random() * 2)
		
		if (randomIndex == 0)
		{
			channelTarget.messages.push({
				id: 1,
				sender: userTest,
				type: messageStatus.TEXT,
				content: "tg"
			})
		}
		else
		{
			channelTarget.messages.push({
				id: 7,
				sender: userTest,
				type: messageStatus.INVITATION,
				target: userAuthenticate,
				status: challengeStatus.PENDING
			})
		}
	}, [channelTarget.messages])

	const { chatRender, setChatRender } = useContext(ChatContext)!


	return (
		<Style>
			{
				<ScrollBar
					firstRenderState={{
						value: chatRender,
						setter: setChatRender
					}}
					activeState
				>
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
			}
		</Style>
	)
}

export default Discussion