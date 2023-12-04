import { useContext } from "react"
import { ChannelName, ReduceButton, Style } from "./style"
import Icon from "../../../../componentsLibrary/Icon"
import ChatContext from "../../../../contexts/ChatContext"
import ReduceIcon from "../../../../assets/reduce.png"

type PropsBanner = {
	name: string
}

function Banner({ name } : PropsBanner) {

	const { displayChat } = useContext(ChatContext)!

	return (
		<Style>
			<ChannelName>
				{name}
			</ChannelName>
			<ReduceButton>
				<Icon
					onClick={() => displayChat(false)}
					src={ReduceIcon} size={24}
					alt="Reduce button" title="Reduce"
				/>
			</ReduceButton>
		</Style>
	)
}

export default Banner