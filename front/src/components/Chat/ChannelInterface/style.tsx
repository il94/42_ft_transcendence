import styled from "styled-components"
import colors from "../../../utils/colors"

export const Style = styled.div`

	display: flex;
	flex-direction: column;

	width: 100%;
	height: 100%;

	background-color: ${colors.chatWindow};

`

export const Avatar = styled.label<{ src: string }>`

	position: relative;

	width: 40px;
	height: 40px;
	min-width: 40px;
	min-height: 40px;

	border: none;
	border-radius: 50%;

	background-image: url(${(props) => props.src});
	background-position: center;
	background-size: cover;

	&:hover {
		cursor: pointer;
		filter: brightness(70%);
		background-color: rgba(0, 0, 0, 0.5);

		&::after {
			content: 'Upload';
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);

			font-size: 9px;
      		font-weight: bold;

		}
	}
	&:focus-visible {
		outline: 3px solid ${colors.focusButton};
	}

`

export const ButtonsWrapper = styled.div`

	display: flex;
	justify-content: space-evenly;

	width: 65%;

`