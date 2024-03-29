import {
	createContext,
	Dispatch,
	SetStateAction
} from 'react'

import {
	Channel,
	User,
	UserAuthenticate
} from '../utils/types'

const InteractionContext = createContext<{
	userAuthenticate: UserAuthenticate,
	setUserAuthenticate: Dispatch<SetStateAction<UserAuthenticate>>,
	userTarget: User | UserAuthenticate,
	setUserTarget: Dispatch<SetStateAction<User | UserAuthenticate>>,
	channelTarget: Channel | undefined,
	setChannelTarget: Dispatch<SetStateAction<Channel | undefined>>,
	gameState: boolean,
	setGameState: Dispatch<SetStateAction<boolean>>,
	searching: boolean,
	setSearching: Dispatch<SetStateAction<boolean>>
} | undefined>(undefined)

export default InteractionContext