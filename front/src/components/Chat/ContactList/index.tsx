import styled from "styled-components"
import colors from "../../../utils/colors"

import Contact from "./Contact"
import { useContext, useEffect, useRef } from "react"
import { ChatContext } from "../../../pages/Game"

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

	const { contactListScrollValue, setContactListScrollValue } = useContext(ChatContext)!
	const scrollContainerRef = useRef(null)

	useEffect(() => {
		const scrollContainer: any = scrollContainerRef.current

		if (scrollContainer)
			scrollContainer.scrollTop = contactListScrollValue
	}, [])

	function handleScroll(event: any) {
		setContactListScrollValue(event.currentTarget.scrollTop);
	}

	return (
		<Style onScroll={handleScroll} ref={scrollContainerRef}>
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