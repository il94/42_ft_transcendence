import {
	createContext,
	Dispatch,
	SetStateAction
} from 'react'

const CardContext = createContext<{
	card: boolean,
	displayCard: Dispatch<SetStateAction<boolean>>,
	setCardPosition: Dispatch<SetStateAction<{ top: number, left: number }>>
} | undefined>(undefined)

export default CardContext