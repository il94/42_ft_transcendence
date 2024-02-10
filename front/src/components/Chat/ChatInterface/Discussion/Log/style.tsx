import styled from "styled-components"

import colors from "../../../../../utils/colors"

export const Style = styled.div`

	display: flex;

`

export const Message = styled.p`

	margin-top: 5px;
	max-width: 182px; // tester avec value max

	margin-left: auto;
	margin-right: auto;

	padding-left: 3px;
	padding-right: 2px;
	padding-top: 2px;
	padding-bottom: 1px;

	font-size: 10px;
	text-align: center;
	user-select: text;
	overflow-wrap: break-word;

	color: ${colors.textAlt};
	background-color: ${colors.messageFriend};

`