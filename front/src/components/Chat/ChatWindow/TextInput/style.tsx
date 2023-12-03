import styled from "styled-components"
import colors from "../../../../utils/colors"

export const Style = styled.input`

	display: flex;

	width: 100%;
	height: 25px;
	min-height: 25px;

	padding: 0;
	border: none;

	font-size: 12px;

	word-wrap: break-word;

	background-color: ${colors.chatInput};

	&::placeholder {
		font-size: 10px;
		color: ${colors.textTransparent};
	}

	&:focus {
		outline: none;
	}

	&::selection {
		background-color: ${colors.textSelection};
	}

`