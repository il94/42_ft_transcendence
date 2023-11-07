import { Style, ProfileWrapper, ProfileName, ProfilePicture, ProfileInfo, ProfileStatus } from "./style"

function Friend({ color } : {color: string}) {
	return (
		<Style color={color}>
			<ProfileWrapper>
				<ProfilePicture />
				<ProfileInfo>
					<ProfileName>
						Example
					</ProfileName>
					<ProfileStatus>
						En recherche de partie...
					</ProfileStatus>
				</ProfileInfo>
			</ProfileWrapper>
		</Style>
	)
}

export default Friend