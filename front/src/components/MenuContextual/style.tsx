import styled from "styled-components"
import colors from "../../utils/colors"
import effects from "../../utils/effects"

export const Style = styled.div<{$top: number, $left: number}>`

	display: flex;
	flex-direction: column;

	position: absolute;
	left: ${(props) => props.$left}px;
	top: ${(props) => props.$top}px;
	z-index: 999;

	width: 180px;

	${effects.pixelateWindow};

	&:focus {
		outline: none;
	}

`

export const Section = styled.button`

	display: flex;
	justify-content: flex-start;
	align-items: center;

	width: 100%;
	height: 35px;

	color: ${colors.text};
	background-color: ${colors.sectionContextualMenu};

	&:hover {
		cursor: pointer;
		background-color: ${colors.sectionHover};
	}

`

export const SectionName = styled.p`

	margin-left: 15px;

	font-size: 15px;

`