import { useContext } from "react"
import { ChannelName, ReduceButton, Style } from "./style"
import ChatContext from "../../../../contexts/ChatContext"
import ReduceIcon from "../../../../assets/reduce.png"

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