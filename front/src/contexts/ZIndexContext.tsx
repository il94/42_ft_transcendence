import {
	createContext,
	Dispatch,
	SetStateAction
} from 'react'

export const ZIndexContext = createContext<{
	zCardIndex: number,
	setZCardIndex: Dispatch<SetStateAction<number>>,
	zChatIndex: number,
	setZChatIndex: Dispatch<SetStateAction<number>>
} | undefined>(undefined)

export default ZIndexContext