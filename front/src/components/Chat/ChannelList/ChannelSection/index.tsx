import { Dispatch, SetStateAction } from "react"
import { Style, Avatar, ChannelName } from "./style"

type PropsChannel = {
	id: number,
	setChannelIdTarget: Dispatch<SetStateAction<number>>,
	name: string,
	avatar: string,
	backgroundColor: string
}

function ChannelSection({ id, setChannelIdTarget, name, avatar, backgroundColor } : PropsChannel) {
	return (
		<Style
			onClick={() => setChannelIdTarget(id)}
			$backgroundColor={backgroundColor}>
			<Avatar src={avatar}/>
			<ChannelName>
				{name}
			</ChannelName>
		</Style>
	)
}

export default ChannelSection