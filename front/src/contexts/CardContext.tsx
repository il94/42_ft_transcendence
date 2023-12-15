import {
	createContext,
	Dispatch,
	SetStateAction
} from 'react'

const CardContext = createContext<{
	card: boolean,
	displayCard: Dispatch<SetStateAction<boolean>>,
	cardPosition: {
		left?: number,
		right?: number,
		top?: number,
		bottom?: number
	},
	setCardPosition: Dispatch<SetStateAction<{
		left?: number,
		right?: number,
		top?: number,
		bottom?: number
	}>>
} | undefined>(undefined)

export default CardContext