import {
	createContext,
	Dispatch,
	SetStateAction
} from 'react'

import { ChannelData, User, UserAuthenticate } from '../utils/types'

const InteractionContext = createContext<{
	userAuthenticate: UserAuthenticate,
	setUserAuthenticate: Dispatch<SetStateAction<UserAuthenticate>>,
	userTarget: User | UserAuthenticate,
	setUserTarget: Dispatch<SetStateAction<User | UserAuthenticate>>,
	channelTarget: ChannelData | undefined,
	setChannelTarget: Dispatch<SetStateAction<ChannelData | undefined>>,

} | undefined>(undefined)

export default InteractionContext