import styled from "styled-components"
import colors from "../../utils/colors"

const Section = styled.button`

	display: flex;
	justify-content: flex-start;
	align-items: center;

	width: 100%;
	min-height: 35px;

	color: ${colors.text};
	background-color: ${colors.sectionContextualMenu};

	&:hover {
		cursor: pointer;
		background-color: ${colors.sectionContextualMenuHover};
	}
	&:focus-visible {
		outline: none;
		background-color: ${colors.sectionContextualMenuFocus};
	}

`

export default Section

export const SectionName = styled.p`

	margin-left: 15px;

	font-size: 15px;

`