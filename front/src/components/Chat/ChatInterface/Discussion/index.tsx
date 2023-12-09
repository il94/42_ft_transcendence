import { useContext } from "react"

import { Style } from "./style"

import ContactMessage from "./ContactMessage"
import UserMessage from "./UserMessage"
import ScrollBar from "../../../../componentsLibrary/ScrollBar"
import ContactDuelInvitation from "./ContactDuelInvitation"
import UserDuelInvitation from "./UserDuelInvitation"

import ChatContext from "../../../../contexts/ChatContext"

import { MessageInvitation, MessageText } from "../../../../utils/types"
import { challengeStatus } from "../../../../utils/status"

type PropsDiscussion = {
	// messages: (MessageText | MessageInvitation)[]
}

function Discussion({ /* messages */ } : PropsDiscussion) {

	const { chatScrollValue, setChatScrollValue, chatRender, setChatRender } = useContext(ChatContext)!

	/* ============ Temporaire ============== */

	// Recup les Messages du Channel en faisant un map quand le format sera defini

	const messages: (MessageText | MessageInvitation)[]  = [
		{
			id: 30,
			sender: "Someone",
			type: "text",
			content: "Contact message"
		},
		{
			id: 31,
			sender: "You",
			type: "text",
			content: "User message"
		},
		{
			id: 33,
			sender: "You",
			type: "invitation",
			target: "target",
			status: challengeStatus.PENDING
		},
		{
			id: 34,
			sender: "You",
			type: "invitation",
			target: "target",
			status: challengeStatus.ACCEPTED
		},
		{
			id: 35,
			sender: "You",
			type: "invitation",
			target: "target",
			status: challengeStatus.CANCELLED
		},
		{
			id: 36,
			sender: "You",
			type: "invitation",
			target: "target",
			status: challengeStatus.IN_PROGRESS
		},
		{
			id: 37,
			sender: "You",
			type: "invitation",
			target: "target",
			status: challengeStatus.FINISHED
		},
		{
			id: 40,
			sender: "Someone",
			type: "invitation",
			target: "target",
			status: challengeStatus.PENDING
		},
		{
			id: 41,
			sender: "Someone",
			type: "invitation",
			target: "target",
			status: challengeStatus.ACCEPTED
		},
		{
			id: 42,
			sender: "Someone",
			type: "invitation",
			target: "target",
			status: challengeStatus.CANCELLED
		},
		{
			id: 43,
			sender: "Someone",
			type: "invitation",
			target: "target",
			status: challengeStatus.IN_PROGRESS
		},
		{
			id: 44,
			sender: "Someone",
			type: "invitation",
			target: "target",
			status: challengeStatus.FINISHED
		}
	]

	/* ============================================== */

	return (
		<Style>
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
				messages.map((message) => (
					message.sender === "You" ?
						message.type === "text" ?
							<UserMessage
								key={"message" + message.id} // a definir
								content={(message as MessageText).content}
							/>
						:
							<UserDuelInvitation
								key={"message" + message.id} // a definir
								opponent={(message as MessageInvitation).target}
								status={(message as MessageInvitation).status}
							/>
					:
						message.type === "text" ?
							<ContactMessage
								key={"message" + message.id} // a definir
								userName={message.sender}
								content={(message as MessageText).content}
							/>
						:
							<ContactDuelInvitation
								key={"message" + message.id} // a definir
								userName={message.sender}
								opponent={(message as MessageInvitation).target}
								status={(message as MessageInvitation).status}
							/>
							))
			}
				<div style={{ marginTop: "3px" }} />
			</ScrollBar>
		</Style>
	)
}

export default Discussion