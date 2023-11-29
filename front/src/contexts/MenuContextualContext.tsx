import {
	createContext,
	Dispatch,
	SetStateAction
} from 'react'

const MenuContextualContext = createContext<{
	menuInteraction: boolean,
	displayMenuContextual: Dispatch<SetStateAction<boolean>>,
	menuInteractionPosition: { top: number; left: number },
	setMenuContextualPosition: Dispatch<SetStateAction<{ top: number, left: number }>>,
} | undefined>(undefined)

export default MenuContextualContext