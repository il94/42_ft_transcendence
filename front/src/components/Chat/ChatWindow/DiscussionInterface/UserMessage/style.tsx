import styled from "styled-components"
import colors from "../../../../../utils/colors"

export const Style = styled.div`

	display: flex;
	justify-content: flex-end;

	min-width: 31px;
	max-width: 182px;
	min-height: 15px;

	margin-top: 5px;
	margin-right: 6px;
	margin-left: 60px;

	font-size: 10px;

`

export const Text = styled.p`

	height: 100%;

	padding-left: 2px;
	padding-right: 3px;
	padding-top: 2px;
	padding-bottom: 1px;

	color: ${colors.textAlt};
	background-color: ${colors.messageUser};

`