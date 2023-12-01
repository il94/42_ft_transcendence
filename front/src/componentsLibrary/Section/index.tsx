import styled from "styled-components"
import colors from "../../utils/colors"

const Section = styled.button`

	display: flex;
	justify-content: flex-start;
	align-items: center;

	width: 100%;
	height: 35px;

	color: ${colors.text};
	background-color: ${colors.sectionContextualMenu};

	&:hover {
		cursor: pointer;
		background-color: ${colors.sectionHover};
	}

`

export default Section