import styled from "styled-components"

import colors from "../../utils/colors"

export const Style = styled.div`

	display: flex;

	width: 250px;
	height: 100%;
	min-width: 250px;
	min-height: 159px;

	background-color: ${colors.module};

`

export const FriendsWrapper = styled.div `

	width: 240px;
	height: 100%;

	overflow-y: auto;
	overflow-x: hidden;

	background-color: ${colors.module};

	&:not(:hover) {
		&::-webkit-scrollbar {
			display: none;
		}
	}

	&:hover {
		
		&::-webkit-scrollbar {
			width: 5px;
			-webkit-appearance: none;
		}
	
		&::-webkit-scrollbar-thumb {
			background-color: ${colors.scrollingBar};
		}
		
	}

`

export const ReduceButton = styled.button`

	width: 10px;
	height: 100%;
	min-width: 10px;
	min-height: 159px;

	margin: 0;
	padding: 0;
	border: 0;

	background-color: ${colors.reduceButton};

	&:hover {
		
		cursor: pointer;

		background-color: ${colors.reduceButtonHover};

	}

`