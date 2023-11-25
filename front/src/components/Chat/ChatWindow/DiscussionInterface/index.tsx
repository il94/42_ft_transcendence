import { useContext } from "react"

import { Style } from "./style"

import ContactMessage from "./ContactMessage"
import UserMessage from "./UserMessage"
import ScrollBar from "../../../../componentsLibrary/ScrollBar"
import ContactDuelInvitation from "./ContactDuelInvitation"
import UserDuelInvitation from "./UserDuelInvitation"

import ChatContext from "../../../../contexts/ChatContext"

import status from "../../../../utils/status"

function DiscussionInterface() {

	const { chatScrollValue, setChatScrollValue, chatRender, setChatRender } = useContext(ChatContext)!

	return (
		<Style>
			<ScrollBar state={{ value: chatScrollValue, setter: setChatScrollValue }}
						firstRenderState={{ value: chatRender, setter: setChatRender }}>

				<ContactMessage userName={"i"} content={"iiiiiiii"} />
				<ContactMessage userName={"Claire zer"} content={"Kikou"} />
				<ContactMessage userName={"Adouay"} content={"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna lol a  aliqua."} />
				<UserMessage content={"salut"} />
				<ContactMessage userName={"Test"} content={"Jde fais un test car c'estl"} />
				<ContactMessage userName={"Test"} content={"    WWWWWWWWW\nWWWWWWWWWWW    ALORS    CA VA iiiiiiiiiiiiiiiiiiii"} />
				<UserMessage content={"    WWWWWWWWW\nWWWWWWWWWWW    ALORS    CA VA iiiiiiiiiiiiiiiiiiii"} />
				<ContactDuelInvitation userName={"A"} opponent={"B"} state={status.PENDING} />
				<ContactDuelInvitation userName={"A"} opponent={"B"} state={status.IN_PROGRESS} />
				<ContactDuelInvitation userName={"A"} opponent={"B"} state={status.FINISHED} />
				<ContactDuelInvitation userName={"A"} opponent={"B"} state={status.ACCEPTED} />
				<ContactDuelInvitation userName={"A"} opponent={"B"} state={status.CANCELLED} />
				<UserDuelInvitation opponent={"WWWWWWWW"} state={status.PENDING} />
				<UserDuelInvitation opponent={"WWWWWWWW"} state={status.CANCELLED} />
				<div style={{ marginTop: "3px" }} />
			</ScrollBar>
		</Style>
	)
}

export default DiscussionInterface