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
	closeFunction?: Dispatch<SetStateAction<boolean>>,
	closeFunctionAlt?: any,
}

function CloseButton({ closeFunction, closeFunctionAlt } : CloseButtonProps) {
	return (
		<Style>
			{
				closeFunction ?
				<Icon
					onClick={() => closeFunction(false)}
					src={CloseIcon} size={24}
					alt="Close button" title="Close" />
				: closeFunctionAlt ?
				<Icon
					onClick={() => closeFunctionAlt()}
					src={CloseIcon} size={24}
					alt="Close button" title="Close" />
				:
				null
			}
		</Style>
	)
}

export default CloseButton