import {
	createContext,
	Dispatch,
	SetStateAction
} from 'react'

export const ChatContext = createContext<{
	chat: boolean,
	displayChat: Dispatch<SetStateAction<boolean>>,
	contactListScrollValue: number,
	setChannelListScrollValue: Dispatch<SetStateAction<number>>,
	chatScrollValue: number,
	setChatScrollValue: Dispatch<SetStateAction<number>>,
	chatRender: boolean,
	setChatRender: Dispatch<SetStateAction<boolean>>
} | undefined>(undefined)

export default ChatContext