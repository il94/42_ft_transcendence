import styled from "styled-components"
import colors from "../../../../utils/colors"

export const Style = styled.div`

	display: flex;
	flex-direction: column;
	justify-content: flex-end;

	width: 100%;
	min-height: 188px;

`

export const MessagesWrapper = styled.div`

	overflow-y: auto;
	overflow-x: hidden;

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

		& .userMessages {
			margin-right: 1px;
		}
	}
`