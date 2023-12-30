import {
	createContext,
	Dispatch,
	SetStateAction
} from 'react'
import { contextualMenuStatus } from '../utils/status'

const ContextualMenuContext = createContext<{
	contextualMenu: {
		display: boolean,
		type: contextualMenuStatus | undefined
	},
	displayContextualMenu: Dispatch<SetStateAction<{
		display: boolean,
		type: contextualMenuStatus | undefined
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