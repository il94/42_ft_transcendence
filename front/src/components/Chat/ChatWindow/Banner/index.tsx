import { ChannelName, ReduceButton, Style } from "./style"
import ReduceIcon from "../../../../assets/reduce.png"
import { useContext } from "react"
import { ChatContext } from "../../../../pages/Game"

function Banner() {

	const { displayChat } = useContext(ChatContext)!

	return (
		<Style>
			<ChannelName>
				Example
			</ChannelName>
			<ReduceButton src={ReduceIcon} onClick={() => displayChat(false)}
				alt="Reduce button" title="Reduce" />
		</Style>
	)
}

export default Banner