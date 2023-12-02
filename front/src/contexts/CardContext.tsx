import {
	createContext,
	Dispatch,
	SetStateAction
} from 'react'

const CardContext = createContext<{
	card: boolean,
	displayCard: Dispatch<SetStateAction<boolean>>,
	cardPosition: {
		top?: number,
		left?: number,
		right?: number
	},
	setCardPosition: Dispatch<SetStateAction<{
		top?: number,
		left?: number,
		right?: number
	}>>,
	cardIdTarget: number,
	setIdTargetCard: Dispatch<SetStateAction<number>>
} | undefined>(undefined)

export default CardContext