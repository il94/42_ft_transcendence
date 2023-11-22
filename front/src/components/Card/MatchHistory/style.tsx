import styled from "styled-components"
import colors from "../../../utils/colors"

export const Style = styled.div`

	position: relative;

	margin-top: auto;
	margin-bottom: auto;

	width: 200px;
	height: 150px;
	border: 5px solid ${colors.historyBorder};

	overflow-y: hidden;

	background-color: ${colors.history};

`