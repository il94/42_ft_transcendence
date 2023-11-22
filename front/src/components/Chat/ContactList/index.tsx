import styled from "styled-components"
import colors from "../../../utils/colors"

import Contact from "./Contact"
import { useContext, useEffect, useRef } from "react"
import { ChatContext } from "../../../pages/Game"
import ScrollBar from "../../ScrollBar"

const Style = styled.div`

	display: flex;
	flex-direction: column;

	width: 33.42%;
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