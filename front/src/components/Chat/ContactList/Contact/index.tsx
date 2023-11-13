import { Style, ProfilePicture, ContactName } from "./style"

function Contact({ color } : {color: string}) {
	return (
		<Style color={color}>
				<ProfilePicture />
				<ContactName>
					Example
				</ContactName>
		</Style>
	)
}

export default Contact