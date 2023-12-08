import {
	createContext,
	Dispatch,
	SetStateAction
} from 'react'

const ContextualMenuContext = createContext<{
	contextualMenu: {
		display: boolean,
		type: string
	},
	displayContextualMenu: Dispatch<SetStateAction<{
		display: boolean,
		type: string
	}>>,
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
	secondaryContextualMenuHeight: number,
	setSecondaryContextualMenuHeight: Dispatch<SetStateAction<number>>

} | undefined>(undefined)

export default ContextualMenuContext