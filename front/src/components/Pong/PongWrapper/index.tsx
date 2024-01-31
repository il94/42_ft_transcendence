import { useRef, useState, useContext } from "react"
import styled from "styled-components"
import axios, { AxiosResponse } from "axios"
import AuthContext from "../../../contexts/AuthContext"


import Pong from "./Pong"
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
	const { token, setToken, url } = useContext(AuthContext)!

    const [gameState, setGameState] = useState<boolean>(false)

    if (wrapperRef.current)
        console.log(wrapperRef.current.getBoundingClientRect())

    function handlePlayButton(){
        setGameState(true)
        console.log("coucou")
        const response = axios.post(`http://${url}:3333/pong/`, {
			headers: {
				'Authorization': `Bearer ${token}`
			}
		} )
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