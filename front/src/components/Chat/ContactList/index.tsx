import styled from "styled-components"

import Contact from "./Contact"
import ScrollBar from "../../ScrollBar"

import colors from "../../../utils/colors"

const Style = styled.div`

	display: flex;
	flex-direction: column;

	width: 128px;
	height: 100%;

	background-color: ${colors.contactList};

`

function ContactList() {

	return (
		<Style>
			<ScrollBar>
				<Contact color={colors.sectionTransparent} />
				<Contact color={colors.sectionAltTransparent} />
				<Contact color={colors.sectionTransparent} />
				<Contact color={colors.sectionAltTransparent} />
				<Contact color={colors.sectionTransparent} />
				<Contact color={colors.sectionAltTransparent} />
				<Contact color={colors.sectionTransparent} />
				<Contact color={colors.sectionAltTransparent} />
			</ScrollBar>
		</Style>
	)
}

export default ContactList