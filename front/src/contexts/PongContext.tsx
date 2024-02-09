import { Dispatch, SetStateAction, createContext } from "react";


const PongContext = createContext<{
	focusPaddle: boolean,
	setFocusPaddle: Dispatch<SetStateAction<boolean>>,
	
} | undefined>(undefined)

export default PongContext