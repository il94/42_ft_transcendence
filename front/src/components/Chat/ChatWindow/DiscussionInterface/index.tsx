import { MessagesWrapper, MiniSpace, Style } from "./style"
import Message from "./Message"

function DiscussionInterface() {
	return (
		<Style>
			<MessagesWrapper>
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