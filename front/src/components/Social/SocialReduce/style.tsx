import styled from "styled-components"

import colors from "../../../utils/colors"

export const Style = styled.div`

	display: flex;

	width: 58px;
	height: 100%;
	min-width: 58px;
	min-height: 159px;

`

export const Interface = styled.div`

	width: 48px;
	height: 100%;
	min-width: 48px;
	min-height: 159px;

	background-color: ${colors.module};

`

export const ReduceButton = styled.button`

	width: 10px;
	height: 100%;
	min-width: 10px;
	min-height: 159px;

	margin: 0;
	padding: 0;
	border: 0;

	background-color: ${colors.buttonBrown};

	&:hover {
		
		cursor: pointer;

		background-color: #A05014;

	}

`