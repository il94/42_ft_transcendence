import styled from "styled-components"
import colors from "../../../utils/colors"

export const Style = styled.form`

	display: flex;
	flex-direction: column;
	align-items: center;

	width: 245px;

	background-color: ${colors.chatWindow};

`

export const Text = styled.p`

	margin-top: 30px;

	font-size: 20px;
	text-align: center;
`

export const Input = styled.input<{ $error?: boolean }>`

	width: 90%;

	margin-top: 50px;
	border: none;
	border-bottom: 1px solid ${(props) => props.$error && colors.textError};

	font-size: 20px;
	text-align: center;


	background-color: transparent;

	&:focus {
		outline: none;
		border-color: ${(props) => props.$error ? colors.textError : colors.focusBorderText};
	}

`

export const ErrorMessage = styled.p`
	
	display: flex;
	justify-content: center;
	align-items: center;

	width: 100%;
	height: 20px;

	text-align: center;
	font-size: 10px;

	color: ${colors.textError};

`
