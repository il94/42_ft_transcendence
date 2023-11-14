import styled from "styled-components"
import colors from "../../../utils/colors"

export const Style = styled.div`

	display: flex;

	width: 100%;
	height: 100%;
	min-width: 100%;
	min-height: 159px;

	background-color: ${colors.module};

`

export const FriendsWrapper = styled.div`

	width: 48px;
	height: 100%;
	min-width: 48px;
	min-height: 159px;

	overflow-y: auto;
	overflow-x: hidden;

	background-color: ${colors.module};

	&::-webkit-scrollbar {
		display: none;
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
