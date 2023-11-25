import { useContext } from "react"
import { RoomName, ReduceButton, Style } from "./style"
import Icon from "../../../../componentsLibrary/Icon"
import ChatContext from "../../../../contexts/ChatContext"
import ReduceIcon from "../../../../assets/reduce.png"

function Banner() {

	const { displayChat } = useContext(ChatContext)!

	return (
		<Style>
			<RoomName>
				WWWWWWWW
			</RoomName>
			<ReduceButton>
				<Icon src={ReduceIcon} size="24px" onClick={() => displayChat(false)}
					alt="Reduce button" title="Reduce" />
			</ReduceButton>
		</Style>
	)
}

export default Banner