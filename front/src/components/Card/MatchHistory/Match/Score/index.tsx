import styled from "styled-components"

const Style = styled.div`

	display: flex;
	align-items: center;

	color: black;

`

const ScoreUser = styled.p`
	
	margin-right: 2px;

`

const ScoreOpponent = styled.p`
	
	margin-left: 2px;
	
`

function Score() {
	return (
		<Style>
			<ScoreUser>
				0
			</ScoreUser>
			<p>-</p>
			<ScoreOpponent>
				0
			</ScoreOpponent>
		</Style>
	)
}

export default Score