import styled from "styled-components"
import colors from "../../../utils/colors"

import Contact from "./Contact"

const Style = styled.div`

	display: flex;
	flex-direction: column;

	width: 33.42%;
	height: 100%;

	overflow-y: auto;
	overflow-x: hidden;

	background-color: ${colors.contactList};

	&:not(:hover) {
		&::-webkit-scrollbar {
			display: none;
		}
	}

	&:hover {
		
		&::-webkit-scrollbar {
			width: 5px;
			-webkit-appearance: none;
		}
	
		&::-webkit-scrollbar-thumb {
			background-color: ${colors.scrollingBarTransparent};
		}
		
	}


`

function ContactList() {
	return (
		<Style>
			<Contact color={colors.sectionTransparent} />
			<Contact color={colors.sectionAltTransparent} />
			<Contact color={colors.sectionTransparent} />
			<Contact color={colors.sectionAltTransparent} />
			<Contact color={colors.sectionTransparent} />
			<Contact color={colors.sectionAltTransparent} />
			<Contact color={colors.sectionTransparent} />
			<Contact color={colors.sectionAltTransparent} />
		</Style>
	)
}

export default ContactList