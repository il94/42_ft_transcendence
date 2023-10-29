import styled from "styled-components"

import colors from "../../utils/colors"

export const Style = styled.div`

	@media (min-width: 1280px) {

		grid-area: 2 / 1 / 3 / 2;

		display: flex;
		flex-direction: column;
		justify-content: space-between;

		width: 100%;
		/* min-height: 159px; */

		background-color: ${colors.module};

	}

	@media (min-width: 0px) and (max-width: 1280px) {
		display: none;
	}

`