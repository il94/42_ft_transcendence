import styled from 'styled-components'


const Line = styled.div`

	width: 100%;

	border-bottom: 0.5px solid;

`

const TextSeparator = styled.p`

	padding-left: 15px;
	padding-right: 15px;

`


const Style = styled.div`

	display: flex;
	justify-content: space-evenly;
	align-items: center;

	width: 70%;
	height: 50px;

`

type PropsSeparator = {
	word?: boolean
}

function Separator({ word }: PropsSeparator) {
	return (
		<Style>
			<Line />
			{
				word &&
				<>
					<TextSeparator>
						{word}
					</TextSeparator>
					<Line />
				</>
			}
		</Style>
	)
}

export default Separator