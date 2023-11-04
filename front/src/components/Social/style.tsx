import styled from "styled-components"

import colors from "../../utils/colors"

export const Style = styled.div`

	width: 240px;
	height: 100%;
	min-width: 240px;
	min-height: 159px;

	display: flex;
	flex-direction: column;
	justify-content: space-between;

	background-color: ${colors.module};

`

export const ReduceButton = styled.button`
	
	width: 100%;
	height: 15px;

	margin: 0;
	padding: 0;
	border: 0;

	cursor: pointer;

	background-color: ${colors.buttonBrown};

	&:hover {
		
		cursor: pointer;

		background-color: #A05014;

	}

`
