import {
	createContext,
	Dispatch,
	SetStateAction
} from 'react'
import { Socket } from 'socket.io-client'

const AuthContext = createContext<{
	token: string,
	setToken: Dispatch<SetStateAction<string>>,
	socket: Socket | undefined,
	setSocket: Dispatch<SetStateAction<Socket | undefined>>,
	url: string
} | undefined>(undefined)

export default AuthContext