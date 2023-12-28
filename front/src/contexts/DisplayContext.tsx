import {
	createContext,
	Dispatch,
	SetStateAction
} from 'react'

export const DisplayContext = createContext<{
	zCardIndex: number,
	setZCardIndex: Dispatch<SetStateAction<number>>,
	zChatIndex: number,
	setZChatIndex: Dispatch<SetStateAction<number>>,
	zSettingsIndex: number,
	setZSettingsIndex: Dispatch<SetStateAction<number>>,
	zMaxIndex: number,
	setZMaxIndex: Dispatch<SetStateAction<number>>,
	GameWrapperRef: any
} | undefined>(undefined)

export default DisplayContext