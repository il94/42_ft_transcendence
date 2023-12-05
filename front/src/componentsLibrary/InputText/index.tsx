import styled from "styled-components";
import colors from "../../utils/colors";

const InputText = styled.input<{ $width?: number, $fontSize?: number, $error?: boolean, $disable?: boolean }>`

	width: ${(props) => props.$width && props.$width}px;

	border: none;
	border-bottom: 1px solid ${(props) => props.$disable ? colors.textBlocked : props.$error && colors.textError };

	font-size: ${(props) => props.$fontSize && props.$fontSize}px;
	text-align: center;

	background-color: inherit;

	&:focus {
		outline: none;
		border-color: ${(props) => props.$disable ? colors.textBlocked : props.$error ? colors.textError : colors.focusBorderText};
	}

`

export default InputText