const effects = {
	pixelateBorder : `polygon(
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
		)`
}

export default effects