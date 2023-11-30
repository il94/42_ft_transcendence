import styled from "styled-components"
import effects from "../../../utils/effects"

export const Style = styled.div`

	display: flex;
	flex-direction: column;

	position: absolute;
	top: auto;
	/* left:180px; */


	width: 180px;
	height: 175px;

	clip-path: ${effects.pixelateWindow};

	&:focus {
		outline: none;
	}

`
