// import { useEffect, useState } from "react"
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

function PongWrapper() {
	
	// Code temporaire pour tests
	// const [counter, setCounter] = useState(0);
	
	// useEffect(() => {
	// 	const interval = setInterval(() => {
	// 	  setCounter((counter) => counter + 1);
	// 	}, 100);

	// 	console.log("LOL")
	
	// 	return () => {
	// 	  clearInterval(interval);
	// 	};
	//   }, []);

	return (
		<>
		{/* {counter} */}
		<Style>
			<Pong />	
		</Style>
		</>
	)
}

export default PongWrapper