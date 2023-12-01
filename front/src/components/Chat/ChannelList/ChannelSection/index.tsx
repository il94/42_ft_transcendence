import { Style, ProfilePicture, ChannelName } from "./style"

type PropsChannel = {
	// id: number,
	name: string,
	picture: string,
	// type: string,
	color: string
}

function ChannelSection({ /* id, */ name, picture, /* type, */ color } : PropsChannel) {
	return (
		<Style color={color}>
			<ProfilePicture src={picture}/>
			<ChannelName>
				{name}
			</ChannelName>
		</Style>
	)
}

export default ChannelSection