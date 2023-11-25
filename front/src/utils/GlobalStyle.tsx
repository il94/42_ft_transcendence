import { createGlobalStyle } from "styled-components"
import colors from "./colors"

const Style = createGlobalStyle`

	* {
		margin: 0;
		font-family: "Retro Gaming";
	}

	body {
		width: 100%;
		height: 100vh;

		cursor: default;

		overflow-y: hidden;

		user-select: none;

		color: ${colors.text};
		background-color: ${colors.background};
	}

	#root {
		width: 100%;
		height: 100%;
	}

	button {
		
		border: 0;

		cursor: pointer;
		
		text-decoration: none;

	}

`

function GlobalStyle() {
	return (
		<Style />
	)
}

export default GlobalStyle