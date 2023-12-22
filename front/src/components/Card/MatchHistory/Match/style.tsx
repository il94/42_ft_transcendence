import styled from "styled-components"
import colors from "../../../../utils/colors"

export const Style = styled.div<{ $backgroundColor: string }>`

	display: flex;
	justify-content: space-between;
	align-items: center;

	width: 100%;
	height: 30px;

	font-size: 10px;

	background-color: ${(props) => props.$backgroundColor};

`
export const Username = styled.p`

	width: 70px; // ???

	margin-left: 5px;

	text-align: start;

	color: ${colors.textAlt};

`

export const Opponent = styled.p`

	width: 70px; // ???

	margin-right: 5px;

	text-align: end;

	color: ${colors.textAlt};

`