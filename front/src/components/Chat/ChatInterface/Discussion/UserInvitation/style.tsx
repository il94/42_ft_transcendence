import styled from "styled-components"
import colors from "../../../../../utils/colors"

export const Style = styled.div`

	display: flex;
	flex-direction: column;
	align-items: flex-end;

	width: 180px;
	max-height: 52.5px;
	min-height: 35px;
	min-width: 180px;

	margin-top: 5px;
	margin-left: 60px;
	margin-right: 6px;

`

export const Text = styled.div`

	width: 100%;
	height: 50%;

	padding-left: 2px;
	padding-right: 3px;
	padding-top: 2px;
	padding-bottom: 1px;

	text-align: center;
	font-size: 10px;

	color: ${colors.textAlt};
	background-color: ${colors.messageUser};

`

export const ButtonsWrapper = styled.div`

	display: flex;

	width: 185px;
	height: 50%;

`
