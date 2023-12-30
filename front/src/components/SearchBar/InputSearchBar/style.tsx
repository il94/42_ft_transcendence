import styled from "styled-components"
import effects from "../../../utils/effects"
import colors from "../../../utils/colors"

export const Style = styled.div`

	display: flex;

	min-height: 38px;
	
	clip-path: ${effects.pixelateWindow};

`

export const InputText = styled.input`
	
	width: calc(100% - 36px);

	padding-left: 10px;
	border: none;

	text-decoration: none;
	outline: none;

	font-size: 15px;

	background-color: ${colors.section};

	&::placeholder {
		color: ${colors.text};
	}

`
export const ArrowButton = styled.button`
	
	width: 36px;
	
	background-color: ${colors.sectionAlt};

`