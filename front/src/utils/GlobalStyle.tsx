import { createGlobalStyle } from "styled-components"

import colors from "./colors"

const Style = createGlobalStyle`

	@font-face {
		font-family: 'RetroGaming';
		src:
			url('./src/assets/font/retro_gaming.woff2') format('woff2'),
			url('./src/assets/font/retro_gaming.woff') format('woff'),
			url('./src/assets/font/retro_gaming.ttf') format('truetype'),
			url('./src/assets/font/retro_gaming.eot'),
			url('./src/assets/font/retro_gaming.eot?#iefix') format('embedded-opentype'),
			url('./src/assets/font/retro_gaming.svg#svgFontName') format('svg');
	}

	* {
		margin: 0;
		font-family: "RetroGaming";
	}

	body {
		width: 100%;
		height: 100vh;
		
		overflow-y: hidden;

		color: ${colors.text};
		background-color: ${colors.background};
	}

	#root {
		width: 100%;
		height: 100%;
	}

	p {
		cursor: default;
		user-select: none;
	}

`

function GlobalStyle() {
	return (
		<Style />
	)
}

export default GlobalStyle