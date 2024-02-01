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

	loaderChannels: boolean,
	setLoaderChannels: Dispatch<SetStateAction<boolean>>,
	loaderChat: boolean,
	setLoaderChat: Dispatch<SetStateAction<boolean>>,
	loaderFriends: boolean,
	setLoaderFriends: Dispatch<SetStateAction<boolean>>,
	loaderResultsSearchBar: boolean,
	setLoaderResultsSearchBar: Dispatch<SetStateAction<boolean>>,
	loaderMatchsHistory: boolean,
	setLoaderMatchsHistory: Dispatch<SetStateAction<boolean>>,

	displayPopupError: Dispatch<SetStateAction<{ display: boolean, message?: string }>>,
	GameWrapperRef: any
} | undefined>(undefined)

export default DisplayContext