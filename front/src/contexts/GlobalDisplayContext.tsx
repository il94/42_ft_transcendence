import {
	createContext,
	Dispatch,
	SetStateAction
} from 'react'

export const GlobalDisplayContext = createContext<{
	zCardIndex: number,
	setZCardIndex: Dispatch<SetStateAction<number>>,
	zChatIndex: number,
	setZChatIndex: Dispatch<SetStateAction<number>>,
	GameWrapperRef: any
} | undefined>(undefined)

export default GlobalDisplayContext