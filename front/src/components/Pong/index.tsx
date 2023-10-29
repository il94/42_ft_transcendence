import styled from "styled-components"

const Style = styled.div`

	width: 100%;

	background-color: #FD994F;

	@media (min-width: 1280px) {
		grid-area: 2 / 2 / 3 / 3;
	}

	@media (min-width: 0px) and (max-width: 1280px) {
		grid-area: 2 / 1 / 3 / 2 ;
	}
`

function Pong() {
	return (
		<Style>
			Pong
		</Style>
	)
}

export default Pong