import { ChannelName, ReduceButton, Style } from "./style"
import ReduceIcon from "../../../../assets/reduce.png"

function Banner({ displayChat }: { displayChat: React.Dispatch<React.SetStateAction<boolean>> }) {
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