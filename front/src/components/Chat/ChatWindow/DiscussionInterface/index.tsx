import { useContext, useEffect, useRef } from "react"
import { MessagesWrapper, Style } from "./style"
import ContactMessage from "./ContactMessage"
import UserMessage from "./UserMessage"
import { ChatContext } from "../../../../pages/Game"

function DiscussionInterface(){

	const { chatScrollValue, setChatScrollValue, chatRender, setChatRender } = useContext(ChatContext)!
	const scrollContainerRef = useRef(null)

	useEffect(() => {
		const scrollContainer: any = scrollContainerRef.current

		if (scrollContainer)
		{
			if (chatRender)
				scrollContainer.scrollTop = chatScrollValue
			else
			{
				setChatRender(true)
				setTimeout(() => {
					if (scrollContainer)
						scrollContainer.scrollTop = scrollContainer.scrollHeight
				}, 10)
			}
		}
	}, [])

	function handleScroll(event: any) {
		setChatScrollValue(event.currentTarget.scrollTop);
	}

	return (
		<Style>
			<MessagesWrapper onScroll={handleScroll} ref={scrollContainerRef}>
				<ContactMessage userName={"i"} content={"iiiiiiii"} />
				<ContactMessage userName={"Claire zer"} content={"Kikou"} />
				<ContactMessage userName={"Adouay"} content={"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna lol a  aliqua."} />
				<UserMessage content={"salut"} />
				<ContactMessage userName={"Test"} content={"Jde fais un test car c'estl"} />
				<ContactMessage userName={"Test"} content={"    WWWWWWWWW\nWWWWWWWWWWW    ALORS    CA VA iiiiiiiiiiiiiiiiiiii"} />
				<UserMessage content={"    WWWWWWWWW\nWWWWWWWWWWW    ALORS    CA VA iiiiiiiiiiiiiiiiiiii"} />
			</MessagesWrapper>
		</Style>
	)
}

export default DiscussionInterface