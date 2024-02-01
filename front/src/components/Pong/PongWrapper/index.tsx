import { useRef, useState, useContext, useEffect } from "react"
import styled from "styled-components"
import axios, { AxiosResponse } from "axios"
import AuthContext from "../../../contexts/AuthContext"
import Cookies from "js-cookie"
import { User, UserAuthenticate } from "../../../utils/types"
import { Socket } from 'socket.io';


import Pong from "./Pong"
import { emptyUserAuthenticate } from "../../../utils/emptyObjects"
import InteractionContext from "../../../contexts/InteractionContext"
// import colors from "../../utils/colors"

const Style = styled.div`

    position: relative;

    width: 100%;
    height: 100%;

    display: flex;
    align-items: center;
    justify-content: center;

    background-color: yellow;
`

const PlayButtonStyle = styled.div`
    
    position: absolute;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      padding: 10px 20px;
      font-size: 16px;
    background-color: black;
      cursor: pointer;
`

function PongWrapper({social}) {

    const wrapperRef = useRef<HTMLDivElement | null>(null)
	const { token, url } = useContext(AuthContext)!
	// const { token, url } = useContext(Authenticate)!
	const [gameState, setGameState] = useState<boolean>(false)
    const { userAuthenticate } = useContext(InteractionContext)!


    //if (wrapperRef.current)
    //    console.log(wrapperRef.current.getBoundingClientRect())

    async function handlePlayButton(){
        setGameState(true)
        try {
        //     const response = await axios.post(`http://${url}:3333/pong/play`, {}, {
		// 	headers: {
		// 		'Authorization': `Bearer ${token}`
		// 	}
		// })
		console.log('user socket', userAuthenticate)
        userAuthenticate.socket?.emit('searchGame', userAuthenticate.id)
        }
        catch (error) {
            throw (error)
        }
    }

    return (
        <>
        <Style ref={wrapperRef}>
            <PlayButtonStyle onClick={handlePlayButton}>PLAY</PlayButtonStyle>
            <Pong social={social} />    
        </Style>
        </>
    )
}

export default PongWrapper