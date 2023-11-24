import {
	createContext,
	Dispatch,
	SetStateAction
} from 'react'

const CardContext = createContext<{
	card: boolean,
	displayCard: Dispatch<SetStateAction<boolean>>,
	cardPosition: { top: number; left: number },
	setCardPosition: Dispatch<SetStateAction<{ top: number, left: number }>>,
	cardUsername: string,
	setCardUserName: Dispatch<SetStateAction<string>>
} | undefined>(undefined)

export default CardContext