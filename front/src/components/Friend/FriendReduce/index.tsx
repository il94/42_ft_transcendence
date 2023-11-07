import { Style, ProfilePicture } from "./style"

function FriendReduce({ color } : {color: string}) {
	return (
		<Style color={color}>
				<ProfilePicture />
		</Style>
	)
}

export default FriendReduce