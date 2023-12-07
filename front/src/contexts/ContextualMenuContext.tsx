import {
	createContext,
	Dispatch,
	SetStateAction
} from 'react'

const ContextualMenuContext = createContext<{
	contextualMenu: boolean,
	displayContextualMenu: Dispatch<SetStateAction<boolean>>,
	contextualMenuPosition: {
		left?: number,
		right?: number,
		top?: number,
		bottom?: number
	},
	setContextualMenuPosition: Dispatch<SetStateAction<{
		left?: number,
		right?: number,
		top?: number,
		bottom?: number
	}>>,
} | undefined>(undefined)

export default ContextualMenuContext