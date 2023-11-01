import colors from "./colors"

const effects = {

	pixelateWindow : `
		clip-path : polygon(
		0px 8px,
		4px 8px,
		4px 4px,
		8px 4px,
		8px 0px,
		calc(100% - 8px) 0px,
		calc(100% - 8px) 4px,
		calc(100% - 4px) 4px,
		calc(100% - 4px) 8px,
		100% 8px,
		100% calc(100% - 8px),
		calc(100% - 4px) calc(100% - 8px),
		calc(100% - 4px) calc(100% - 4px),
		calc(100% - 8px) calc(100% - 4px),
		calc(100% - 8px) 100%,
		8px 100%,
		8px calc(100% - 4px),
		4px calc(100% - 4px),
		4px calc(100% - 8px),
		0px calc(100% - 8px)
		)
	`,

	pixelateIcon : `
		clip-path: polygon(
		0px calc(100% - 4px),
		4px calc(100% - 4px),
		4px 100%,
		calc(100% - 4px) 100%,
		calc(100% - 4px) calc(100% - 4px),
		100% calc(100% - 4px),
		100% 4px,
		calc(100% - 4px) 4px,
		calc(100% - 4px) 0px,
		4px 0px,
		4px 4px,
		0px 4px
		)
	`,

	shadowButton : `
		border-style: solid;
		border-width: 5px;
		border-color:
		${colors.button}
		${colors.shadowButton}
		${colors.shadowButton}
		${colors.button}
	`

}

export default effects