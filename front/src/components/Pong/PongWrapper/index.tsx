import { useRef, useState, useContext, useEffect } from "react"
import styled from "styled-components"
import axios, { AxiosResponse } from "axios"
import AuthContext from "../../../contexts/AuthContext"
import InteractionContext from "../../../contexts/InteractionContext"




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


	const [gameState, setGameState] = useState<boolean>(false)

	const [EnemyId, setEnemyId] = useState(0)

	// if (wrapperRef.current)
	// 	console.log(wrapperRef.current.getBoundingClientRect())

	async function handlePlayButton(){
		// setGameState(true)
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

	useEffect(() => {
		userAuthenticate.socket?.on("launchGame", (id: number) => {
			setEnemyId(id)
			setGameState(true)
		})

		return () =>{
			userAuthenticate.socket?.off("launchGame")
		}
	})

	return (
		<>
		<Style ref={wrapperRef}>
			<PlayButtonStyle onClick={handlePlayButton}>Search for a Game</PlayButtonStyle>
				{ gameState &&
					<Pong social={social} enemyId={EnemyId}/>
				}
		</Style>
		</>
	)
}

export default PongWrapper