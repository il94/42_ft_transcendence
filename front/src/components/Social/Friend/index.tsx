import {
	Style,
	ProfileName,
	ProfilePicture,
	ProfileInfo,
	ProfileStatus
} from "./style"

function Friend({ color } : { color: string }) {
	return (
		<Style color={color}>
			<ProfilePicture />
			<ProfileInfo>
				<ProfileName>
					Example
				</ProfileName>
				<ProfileStatus>
					En recherche de partie...
				</ProfileStatus>
			</ProfileInfo>
		</Style>
	)
}

export default Friend