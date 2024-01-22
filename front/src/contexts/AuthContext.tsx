import {
	createContext,
	Dispatch,
	SetStateAction
} from 'react'

const AuthContext = createContext<{
	token: string,
	setToken: Dispatch<SetStateAction<string>>,
	url: string
} | undefined>(undefined)

export default AuthContext