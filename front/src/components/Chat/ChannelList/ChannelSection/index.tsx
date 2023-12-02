import { Style, Avatar, ChannelName } from "./style"

type PropsChannel = {
	// id: number,
	name: string,
	avatar: string,
	// type: string,
	color: string
}

function ChannelSection({ /* id, */ name, avatar, /* type, */ color } : PropsChannel) {
	return (
		<Style color={color}>
			<Avatar src={avatar}/>
			<ChannelName>
				{name}
			</ChannelName>
		</Style>
	)
}

export default ChannelSection