import styled from "styled-components"

const Style = styled.div`

	@media (min-width: 1280px) {

		grid-area: 1 / 1 / 2 / 2;

		width: 100%;

		background-color: #FDE14F;

	}

	@media (min-width: 0px) and (max-width: 1280px) {
		display: none;
	}

`

function Logo() {
	return (
		<Style>
			Logo
		</Style>
	)
}

export default Logo