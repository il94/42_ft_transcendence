import { useRef } from "react"
import styled from "styled-components"


import Pong from "./Pong"
// import colors from "../../utils/colors"

const Style = styled.div`

	position: relative;

	width: 100%;
	height: 100%;

	display: flex;
	align-items: center;
	justify-content: center;

	background-color: yellow;
`

function PongWrapper({social}) {

	const wrapperRef = useRef<HTMLDivElement | null>(null)

	if (wrapperRef.current)
		console.log(wrapperRef.current.getBoundingClientRect())

	return (
		<>
		{/* {counter} */}
		<Style ref={wrapperRef}>
			<Pong social={social} />	
		</Style>
		</>
	)
}

export default PongWrapper