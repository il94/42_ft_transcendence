import { useContext, useEffect } from "react"

import { Style } from "./style"

import ContactMessage from "./ContactMessage"
import UserMessage from "./UserMessage"
import ScrollBar from "../../../ScrollBar"
import ChatContext from "../../../../contexts/ChatContext"

function DiscussionInterface(){

	const { chatScrollValue, setChatScrollValue, chatRender, setChatRender } = useContext(ChatContext)!

	return (
		<Style>
				<ScrollBar state={{value: chatScrollValue, setter: setChatScrollValue}} firstRenderState={{value: chatRender, setter: setChatRender}}>

				<ContactMessage userName={"i"} content={"iiiiiiii"} />
				<ContactMessage userName={"Claire zer"} content={"Kikou"} />
				<ContactMessage userName={"Adouay"} content={"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna lol a  aliqua."} />
				<UserMessage content={"salut"} />
				<ContactMessage userName={"Test"} content={"Jde fais un test car c'estl"} />
				<ContactMessage userName={"Test"} content={"    WWWWWWWWW\nWWWWWWWWWWW    ALORS    CA VA iiiiiiiiiiiiiiiiiiii"} />
				<UserMessage content={"    WWWWWWWWW\nWWWWWWWWWWW    ALORS    CA VA iiiiiiiiiiiiiiiiiiii"} />
				<div style={{ marginTop: "3px" }} />
				</ScrollBar>
		</Style>
	)
}

export default DiscussionInterface