import styled from "styled-components"
import colors from "../../../../utils/colors"

export const Style = styled.div`

	display: flex;
	justify-content: space-between;
	align-items: center;

	width: 100%;
	height: 30px;

	font-size: 10px;

	background-color: ${(props) => props.color};

`
export const Username = styled.p`

	width: 70px; // definir par rapport a la taille max de pseudo

	margin-left: 5px;

	text-align: start;

	color: ${colors.textAlt};

`

export const Opponent = styled.p`

	width: 70px; // definir par rapport a la taille max de pseudo

	margin-right: 5px;

	text-align: end;

	color: ${colors.textAlt};

`