import { useEffect, useState } from "react"
import styled from "styled-components"

const Style = styled.div`

	position: relative;

	width: 100%;
	height: 100%;

	background-color: #FD994F;

`

function Pong() {
	
	// Code temporaire pour tests
	const [counter, setCounter] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
		  setCounter((counter) => counter + 1);
		}, 1000);
	
		return () => {
		  clearInterval(interval);
		};
	  }, []);

	return (
		<Style>
			{counter}
		</Style>
	)
}

export default Pong