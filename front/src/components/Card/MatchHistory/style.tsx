import styled from "styled-components"

import colors from "../../../utils/colors"

export const Style = styled.div<{ height: number, $loader: boolean }>`

	margin-top: auto;
	margin-bottom: auto;

	width: 200px;
	height: ${(props) => props.height}px;
	border: ${(props) => (!props.$loader && props.height > 0) && `5px solid ${colors.historyBorder}`};

	overflow-y: hidden;

`

export const NoMatchMessage = styled.p`

	margin-top: 30%;

`