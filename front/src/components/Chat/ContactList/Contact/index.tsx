import { Style, ProfilePicture, ContactName } from "./style"

function Contact({ color } : {color: string}) {
	return (
		<Style color={color}>
			<ProfilePicture />
			<ContactName>
				WWWWWWWW
			</ContactName>
		</Style>
	)
}

export default Contact