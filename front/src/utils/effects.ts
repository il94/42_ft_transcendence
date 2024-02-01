import colors from "./colors"

const effects = {
	pixelateWindow: `
		polygon(
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
	pixelateIcon: `
		polygon(
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
	shadowButton: `
		border-style: solid;
		border-width: 5px;
		border-color:
		${colors.button}
		${colors.shadowButton}
		${colors.shadowButton}
		${colors.button}
	`,
	focusShadowButton: `
		border-style: solid;
		border-width: 5px;
		border-color:
		${colors.focusButton}
		${colors.shadowFocusButton}
		${colors.shadowFocusButton}
		${colors.focusButton}
	`,
	shadowIcon: `
		border-style: solid;
		border-width: 3px;
		border-color:
		${colors.button}
		${colors.shadowButton}
		${colors.shadowButton}
		${colors.button}
	`,
	focusShadowIcon: `
		border-style: solid;
		border-width: 3px;
		border-color:
		${colors.focusButton}
		${colors.shadowFocusButton}
		${colors.shadowFocusButton}
		${colors.focusButton}
	`

}

export default effects