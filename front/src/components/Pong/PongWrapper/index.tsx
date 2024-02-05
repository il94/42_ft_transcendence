import { useRef, useState, useContext, useEffect } from "react"
import styled from "styled-components"
import axios, { AxiosResponse } from "axios"
import AuthContext from "../../../contexts/AuthContext"
import InteractionContext from "../../../contexts/InteractionContext"




import Pong from "./Pong"
import { User } from "../../../utils/types"
// import colors from "../../utils/colors"

const Style = styled.div`

    position: relative;

    width: 100%;
    height: 100%;

	display: flex;
	/* align-items: center;
	justify-content: center; */

	flex-direction: column;
	align-items: center;
	justify-content: space-evenly;


    background-color: yellow;
`

// const PlayButtonStyle = styled.div`
    
//     position: absolute;
//       top: 20px;
//       left: 50%;
//       transform: translateX(-50%);
//       padding: 10px 20px;
//       font-size: 16px;
//     background-color: black;
//       cursor: pointer;
// `

// const SpectateButtonStyle = styled.div`
	
// 	position: absolute;
//   	top: 75%;
//   	left: 75%;
//   	transform: translateX(-50%);
//   	padding: 2% 4%;
//   	font-size: 16px;
// 	background-color: black;
//   	cursor: pointer;
// `

const PlayButtonStyle = styled.div`
	
	/* position: absolute; */
  	/* top: 50%;
  	left: 50%; */
  	/* transform: translateX(-50%); */
	width: 350px;
  	padding: 2% 4%;
  	font-size: 16px;
	background-color: black;
  	cursor: pointer;
`
const DisconnectTextStyle = styled.div`
	position: absolute;
  	top: 50%;
  	left: 50%;
  	transform: translateX(-50%);
  	padding: 2% 4%;
  	font-size: 16px;
	background-color: black;
  	cursor: pointer;
`

function PongWrapper({social}: any) {

	const wrapperRef = useRef<HTMLDivElement | null>(null)

	const { token, url } = useContext(AuthContext)!
	const { userAuthenticate } = useContext(InteractionContext)!


	const [searching, setSearching] = useState<boolean>(false)

	const [gameState, setGameState] = useState<boolean>(false)

	const [DisconnectText, setDisconnectText] = useState<string | null>(null)

	const [Enemy, setEnemy] = useState<User>()


	function handlePlayButton(){
		console.log('user socket', userAuthenticate)
		setSearching(!searching)
		userAuthenticate.socket?.emit('searchGame', userAuthenticate.id)
	}

	function handleDisconnect(){
		
		setGameState(false)
		console.log("i get the discoonect emit")

		setDisconnectText("Your enemy has Disconnect")
		setTimeout(() => {
			setDisconnectText(null)
		}, 3000)
	}

	useEffect(() => {
		userAuthenticate.socket?.on("decoInGame", handleDisconnect)
		userAuthenticate.socket?.on("launchGame", (user: User) => {
			setEnemy(user)
			setSearching(false)
			setGameState(true)
		})
		return () =>{
			userAuthenticate.socket?.off("launchGame")
			userAuthenticate.socket?.off("decoInGame")
		}
	})

	return (
		<Style ref={wrapperRef}>
			{
			DisconnectText ? (
        	<DisconnectTextStyle>
          		{DisconnectText}
       		 </DisconnectTextStyle>
      		) : (
			<>
			<PlayButtonStyle onClick={handlePlayButton}>{searching ? "Stop searching" : "Search for a Game"}</PlayButtonStyle>
			<PlayButtonStyle >Spectate Mode</PlayButtonStyle>
			</>
			)
			}
			{ gameState &&
				<Pong social={social} enemy={Enemy}/>
			}
		</Style>
		);
}

export default PongWrapper