import {
	createContext,
	Dispatch,
	SetStateAction
} from 'react'

const MenuContextualContext = createContext<{
	menuContextual: boolean,
	displayMenuContextual: Dispatch<SetStateAction<boolean>>,
	menuContextualPosition: { top: number; left: number },
	setMenuContextualPosition: Dispatch<SetStateAction<{ top: number, left: number }>>,
} | undefined>(undefined)

export default MenuContextualContext