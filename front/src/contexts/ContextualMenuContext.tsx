import {
	createContext,
	Dispatch,
	SetStateAction
} from 'react'

const ContextualMenuContext = createContext<{
	contextualMenu: boolean,
	displayContextualMenu: Dispatch<SetStateAction<boolean>>,
	contextualMenuPosition: { top: number; left: number },
	setContextualMenuPosition: Dispatch<SetStateAction<{ top: number, left: number }>>,
} | undefined>(undefined)

export default ContextualMenuContext