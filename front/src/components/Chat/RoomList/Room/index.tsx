import { Style, ProfilePicture, RoomName } from "./style"

type PropsRoom = {
	name: string,
	color: string
}

function Room({ name, color } : PropsRoom) {
	return (
		<Style color={color}>
			<ProfilePicture />
			<RoomName>
				{name}
			</RoomName>
		</Style>
	)
}

export default Room