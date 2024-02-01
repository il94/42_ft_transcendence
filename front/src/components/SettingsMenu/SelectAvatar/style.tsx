import styled from "styled-components";
import colors from "../../../utils/colors";

export const Style = styled.div`

	display: flex;
	flex-direction: column; // temporaire
	justify-content: space-evenly;
	align-items: center;

	min-height: 175px;

`

export const SettingTtile = styled.div`

	font-weight: bold;
	font-size: 19px;

`

export const Avatar = styled.label<{ src: string }>`

	position: relative;

	width: 92px;
	height: 92px;
	min-width: 92px;
	min-height: 92px;

	border: 10px solid ${colors.rankNull};
	border-radius: 50%;

	background-image: url(${(props) => props.src});
	background-size: cover;

	&:hover {
		cursor: pointer;
		filter: brightness(70%);
		background-color: rgba(0, 0, 0, 0.05);

		&::after {
			content: 'Upload';
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);

			font-size: 20.77px;
      		font-weight: bold;

		}
	}
	&:focus-visible {
		outline: none;
		border-color: ${colors.focusButton};
	}

`
