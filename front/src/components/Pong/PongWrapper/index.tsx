import { useRef, useState, useContext, useEffect } from "react"
import styled from "styled-components"
import axios, { AxiosResponse } from "axios"
import AuthContext from "../../../contexts/AuthContext"
import InteractionContext from "../../../contexts/InteractionContext"




import Pong from "./Pong"
import { User } from "../../../utils/types"
import colors from "../../../utils/colors"
import Button from "../../../componentsLibrary/Button"
import Loader from "../../../componentsLibrary/Loader"
import PongPopupError from "./PongPopupError"

import PongContext from "../../../contexts/PongContext"
import CloseButton from "../../../componentsLibrary/CloseButton"
// import colors from "../../utils/colors"

const Style = styled.div<{ $backgroundColor: string }>`

    position: relative;

    width: 100%;
    height: 100%;

	display: flex;
	/* align-items: center;
	justify-content: center; */

	flex-direction: column;
	align-items: center;
	justify-content: space-evenly;


    background-color: ${(props) => props.$backgroundColor};
	transition: background-color 1s ease;

`

function PongWrapper({social}: any) {

	const wrapperRef = useRef<HTMLDivElement | null>(null)

	const { userAuthenticate } = useContext(InteractionContext)!

	const [searching, setSearching] = useState<boolean>(false)

	const [PongSize, setPongSize] = useState<{width: number, height: number}>({width: 0, height: 0})

	const [gameState, setGameState] = useState<boolean>(false)

	const [spectate, setSpectate] = useState<boolean>(false)
	const [difficultyChoose, setDifficultyChoose] = useState<boolean>(false)
	const [score, setScore] = useState<{left: number, right: number}>({left: 0, right: 0})
	const [backgroundColor, setBackgroundColor] = useState<string>(colors.pongWrapperBackground)
	const [pongPopupError, displayPongPopupError] = useState<{ display: boolean, message?: string }>({ display: false, message: undefined })



	function handlePlayButton(){
		setSearching(true)
	}

	function handleChooseDifficulty(dif: number){
		setDifficultyChoose(true)
		userAuthenticate.socket?.emit('searchGame', userAuthenticate.id, dif)
	}

	function handleCancelButton()
	{
		setSearching(false)
		setDifficultyChoose(false)
		userAuthenticate.socket?.emit('cancelSearching', userAuthenticate.id)
	}

	function handleLaunchGame(){
		setSearching(false)
		setDifficultyChoose(false)
		setGameState(true)
	}

	function handleDisconnect(role: string){
		setGameState(false)
		if (role === "player")
			displayPongPopupError({ display: true, message: "Your enemy has Disconnect" })
		else if(role === "watcher")
			displayPongPopupError({ display: true, message: "A player has Disconnect" })

		setBackgroundColor(colors.pongWrapperBackground)
	}

	function handleSpectate(){
		setSpectate(true)
		setGameState(true)
	}

	function handleError(error: any){
		console.log("error: ", error)
		displayPongPopupError({ display: true, message: error })
	}

	useEffect(() => {
		userAuthenticate.socket?.on("error", handleError)
		userAuthenticate.socket?.on("decoInGame", handleDisconnect)
		userAuthenticate.socket?.on("spectate", handleSpectate)
		userAuthenticate.socket?.on("launchGame", handleLaunchGame)
		return () =>{
			userAuthenticate.socket?.off("error")
			userAuthenticate.socket?.off("launchGame")
			userAuthenticate.socket?.off("spectate")
			userAuthenticate.socket?.off("decoInGame")
		}
	})

	const [loaderSize, setLoaderSize] = useState<number>(0)

	useEffect(() => {

		const PongWrapperContainer = wrapperRef.current
		const ratio = 16/9
		if (PongWrapperContainer)
		{
			let maxWidth = Math.min(PongWrapperContainer.getBoundingClientRect().width, PongWrapperContainer.getBoundingClientRect().height * ratio)
			let maxHeight = Math.min(PongWrapperContainer.getBoundingClientRect().height, PongWrapperContainer.getBoundingClientRect().width / ratio)

			setPongSize({width: maxWidth, height: maxHeight})
			setLoaderSize(PongWrapperContainer.getBoundingClientRect().width * 30 / 100)
		}

	}, [window.innerWidth, window.innerHeight, social])

	useEffect(() => {
		if(!gameState)
			setBackgroundColor(colors.pongWrapperBackgroundDraw)
	}, [gameState])

	useEffect(() => {
		if (!gameState)
			setBackgroundColor(colors.pongWrapperBackground)
		else
		{
			if (!spectate)
			{
				if (score.left > score.right)
					setBackgroundColor(colors.pongWrapperBackgroundWin)
				else if (score.left < score.right)
					setBackgroundColor(colors.pongWrapperBackgroundLoose)
				else
					setBackgroundColor(colors.pongWrapperBackgroundDraw)
			}
		}
	}, [score])

	const [focusPaddle, setFocusPaddle] = useState<boolean>(false)

	return (
		<PongContext.Provider value={{ focusPaddle, setFocusPaddle }}>
			<Style $backgroundColor={backgroundColor} ref={wrapperRef} onClick={() => {if(!spectate) setFocusPaddle(true)}}>
				{
					pongPopupError.display && 
						<PongPopupError
							displayPongPopupError={displayPongPopupError}
							message={pongPopupError.message}/>
				}
				<>
				{
					!gameState ?
					<>
						{
							!searching ?
							<Button
								onClick={handlePlayButton}
								type="button" fontSize={"5.5vw"}
								alt="Play button" title="Play !">
								Play !
							</Button>
							:
							(
								!difficultyChoose ?
									<>
										<CloseButton closeFunction={setSearching} />
										<Button onClick={() => handleChooseDifficulty(1)} type="button" fontSize={"3.5vw"} alt="Ez button" title="Ez (noob)"style={{width: "30%"}}>Ez</Button>
										<Button onClick={() => handleChooseDifficulty(2)} type="button" fontSize={"3.5vw"} alt="Medium button" title="Medium"style={{width: "30%"}}>Medium</Button>
										<Button onClick={() => handleChooseDifficulty(3)} type="button" fontSize={"3.5vw"} alt="Hard button" title="Hard"style={{width: "30%"}}>Hard</Button>
									</>
								:
								<>
									<Loader size={loaderSize} />
									<div style={{ height: "8%"}} />
									<Button
										onClick={handleCancelButton}
										type="button" fontSize={"2.25vw"}
										alt="Cancel button" title="Cancel">
										Cancel
									</Button>
								</>
							)
						}
					</>
					:
					<Pong width={PongSize.width} height={PongSize.height} score={score} setScore={setScore} setGameState={setGameState} setSpectate={setSpectate} spectate={spectate}
							social={social} />
					}
				</>
			</Style>
		</PongContext.Provider>
		);
}

export default PongWrapper