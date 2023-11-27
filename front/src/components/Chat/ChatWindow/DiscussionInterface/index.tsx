import { useContext } from "react"

import { Style } from "./style"

import ContactMessage from "./ContactMessage"
import UserMessage from "./UserMessage"
import ScrollBar from "../../../../componentsLibrary/ScrollBar"
import ContactDuelInvitation from "./ContactDuelInvitation"
import UserDuelInvitation from "./UserDuelInvitation"

import ChatContext from "../../../../contexts/ChatContext"

import { MessageInvitation, MessageText } from "../../../../utils/types"

import status from "../../../../utils/status"

type PropsDiscussionInterface = {
	targetId: number
}

function DiscussionInterface({ targetId } : PropsDiscussionInterface) {

	const { chatScrollValue, setChatScrollValue, chatRender, setChatRender } = useContext(ChatContext)!

	/* ============ Temporaire ============== */

	// Recup les Messages du Channel avec un truc du style
	// axios.get("http://localhost:3333/user&id=?/channel&id=targetId")

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
			state: status.PENDING
		},
		{
			id: 34,
			sender: "You",
			type: "invitation",
			target: "target",
			state: status.ACCEPTED
		},
		{
			id: 35,
			sender: "You",
			type: "invitation",
			target: "target",
			state: status.CANCELLED
		},
		{
			id: 36,
			sender: "You",
			type: "invitation",
			target: "target",
			state: status.IN_PROGRESS
		},
		{
			id: 37,
			sender: "You",
			type: "invitation",
			target: "target",
			state: status.FINISHED
		},
		{
			id: 40,
			sender: "Someone",
			type: "invitation",
			target: "target",
			state: status.PENDING
		},
		{
			id: 41,
			sender: "Someone",
			type: "invitation",
			target: "target",
			state: status.ACCEPTED
		},
		{
			id: 42,
			sender: "Someone",
			type: "invitation",
			target: "target",
			state: status.CANCELLED
		},
		{
			id: 43,
			sender: "Someone",
			type: "invitation",
			target: "target",
			state: status.IN_PROGRESS
		},
		{
			id: 44,
			sender: "Someone",
			type: "invitation",
			target: "target",
			state: status.FINISHED
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
								state={(message as MessageInvitation).state}
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
								state={(message as MessageInvitation).state}
							/>
							))
			}
				<div style={{ marginTop: "3px" }} />
			</ScrollBar>
		</Style>
	)
}

export default DiscussionInterface