import styled from "styled-components"

import Profile from "../Profile"

import colors from "../../utils/colors"

const Style = styled.div`

/* @media (min-width: 1280px) { */

	grid-area: 2 / 1 / 3 / 2;

	display: flex;
	flex-direction: column;
	justify-content: space-between;

	width: 100%;
	/* min-height: 159px; */

	background-color: ${colors.module};

/* } */

`

function Social() {
	return (
		<Style>
			Social
			<Profile />
		</Style>
	)
}

export default Social