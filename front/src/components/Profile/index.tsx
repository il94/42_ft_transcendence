import styled from "styled-components"

import colors from "../../utils/colors"

const Style = styled.div`

	width: 100%;
	/* height: 53px; */

	background-color: ${colors.profile};
`

function Profile() {
	return (
		<Style>
			Profile
		</Style>
	)
}

export default Profile