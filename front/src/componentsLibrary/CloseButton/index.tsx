import {
	Dispatch,
	SetStateAction
} from "react"

import styled from "styled-components"

import Icon from "../Icon"

import CloseIcon from "../../assets/close.png"

const Style = styled.div`

	position: absolute;
	top: 2.5px;
	right: 6.5px;
	z-index: inherit;
`

type CloseButtonProps = {
	closeFunction: Dispatch<SetStateAction<boolean>>
}

function CloseButton({ closeFunction } : CloseButtonProps) {
	return (
		<Style>
			<Icon
				onClick={() => closeFunction(false)}
				src={CloseIcon} size={24}
				alt="Close button" title="Close" />
		</Style>
	)
}

export default CloseButton