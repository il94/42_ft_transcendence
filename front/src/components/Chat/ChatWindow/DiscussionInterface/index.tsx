import { useContext, useEffect, useRef, useState } from "react"
import { MessagesWrapper, MiniSpace, Style } from "./style"
import Message from "./Message"
import { ChatContext } from "../../../../pages/Game"

function DiscussionInterface(){

	const { chatScrollValue, setChatScrollValue, chatRender, setChatRender } = useContext(ChatContext)!
	const scrollContainerRef = useRef(null)

	useEffect(() => {
		const scrollContainer: any = scrollContainerRef.current

		if (scrollContainer)
			scrollContainer.scrollTop = chatScrollValue
	}, [])

	useEffect(() => {
		const scrollContainer: any = scrollContainerRef.current

		if (!chatRender)
		{
			setChatRender(true)
			setTimeout(() => {
				if (scrollContainer)
					scrollContainer.scrollTop = scrollContainer.scrollHeight
			}, 10)
		}
	}, [])

	function handleScroll(event: any) {
		setChatScrollValue(event.currentTarget.scrollTop);
	}

	return (
		<Style>
			<MessagesWrapper onScroll={handleScroll} ref={scrollContainerRef}>
				<Message userName={"i"} content={"iiiiiiii"} />
				<Message userName={"Claire zer"} content={"Kikou"} />
				<Message userName={"Adouay"} content={"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna lol a  aliqua."} />
				<Message userName={"Test"} content={"Jde fais un test car c'estl"} />
				<Message userName={"Test"} content={"    WWWWWWWWW\nWWWWWWWWWWW    ALORS    CA VA iiiiiiiiiiiiiiiiiiii"} />
				<MiniSpace />
			</MessagesWrapper>
		</Style>
	)
}

export default DiscussionInterface