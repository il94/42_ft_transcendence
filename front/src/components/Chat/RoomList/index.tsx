import styled from "styled-components"

import Room from "./Room"
import ScrollBar from "../../../componentsLibrary/ScrollBar"

import colors from "../../../utils/colors"

const Style = styled.div`

	display: flex;
	flex-direction: column;

	width: 128px;
	height: 100%;

	background-color: ${colors.contactList};

`

function RoomList() {

	return (
		<Style>
			<ScrollBar>
				<Room name={"WWWWWWWW"} color={colors.sectionTransparent} />
				<Room name={"voici"} color={colors.sectionAltTransparent} />
				<Room name={"des"} color={colors.sectionTransparent} />
				<Room name={"channels"} color={colors.sectionAltTransparent} />
				<Room name={"cool"} color={colors.sectionTransparent} />
				<Room name={"oui"} color={colors.sectionAltTransparent} />
				<Room name={"non"} color={colors.sectionTransparent} />
				<Room name={"ok"} color={colors.sectionAltTransparent} />
			</ScrollBar>
		</Style>
	)
}

export default RoomList