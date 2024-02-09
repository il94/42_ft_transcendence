import  {useState, useEffect, KeyboardEvent, useRef, useContext, Dispatch, SetStateAction } from 'react'

import styled from 'styled-components'
import Paddle from './Paddle'
import Ball from './Ball'
import Score from './Score'
import InteractionContext from "../../../../contexts/InteractionContext"
import { User } from '../../../../utils/types'
import Button from "../../../../componentsLibrary/Button"
import effects from '../../../../utils/effects'
import colors from '../../../../utils/colors'
import CloseButton from '../../../../componentsLibrary/CloseButton'


const Style = styled.div<{ $backgroundColor: string }>`

position: absolute;

width: 83.5%; //83.5%

/* min-width: 95%; */
/* height: 95%; */
aspect-ratio: 16/9;

/* border: 5px;
border-color: white;
border-style: solid;
border-radius: 0.03ch; */

clip-path: ${effects.pixelateWindow};

/* border: 15px solid #ecb54e; */

background-color: ${(props) => props.$backgroundColor};
transition: background-color 1s ease;
`;

// export enum status {
// 	SOLO = "solo",
// 	WAITING = "waiting",
// 	ONGAME = "ongame"
// }

const NameStyle = styled.div<{ $Hpos: number }>`
	position: absolute;

	font-size:10px;

	top: 10%;
	left: ${(props) => props.$Hpos}%;

	transform: translate(-50%, -50%);

	color: white;
`
const ResultStyle = styled.div<{ $Hpos: number }>`
	position: absolute;

	font-size:50px;

	top: 50%;
	left: ${(props) => props.$Hpos}%;

	transform: translate(-50%, -50%);

	color: white;
`

type PongProps = {
	score: {
		left: number, right: number
	},
	setScore: Dispatch<SetStateAction<{
		left: number,
		right: number
	}>>,
	setGameState: Dispatch<SetStateAction<boolean>>,
	setSpectate: Dispatch<SetStateAction<boolean>>,
	spectate: boolean;
	social: any;
}

function Pong({score, setScore, setGameState, setSpectate, spectate, social, focusPaddle, setFocusPaddle}: PongProps){
	
	const user = useContext(InteractionContext)!

	const PongRef = useRef<HTMLDivElement | null>(null)
	
	const [convertionFactor, setConvertionFactor] = useState<number>(0)
	const [backgroundColor, setBackgroundColor] = useState<string>(colors.pongBackground)

	const [PaddlePos, setPaddlePos] = useState<{top: number, bottom: number}>({top: 0, bottom: 0}) //en px
	const [EnemyPaddlePos, setEnemyPaddlePos] = useState<{top: number, bottom: number}>({top: 0, bottom: 0})

	const [Name, setName] = useState<{left: string, right: string}>({left: "", right: ""})
	
	const [ballSize, setBallSize] = useState(25);
	const [scoreSize, setScoreSize] = useState(75);

	const [gameId, setGameId] = useState(0)
	const [BallPos, setBallPos] = useState ({x: 0, y: 0});

	const [keysPressed, setKeysPressed] = useState<{ [key: string]: boolean }>({}); 

	const [endMessage, setEndMesage] = useState<{display: boolean, message: string}>({display: false, message: "hihi"})

	const handleKeyDown = (event: KeyboardEvent) => {
		
		// console.log("down")
		// event.preventDefault();
		event.stopPropagation();
		
		setKeysPressed((prevKeys) => ({ ...prevKeys, [event.key]: true }));
	};
	
	const handleKeyUp = (event: KeyboardEvent) => {
		
		// console.log("up")
		// event.preventDefault();
		event.stopPropagation();
		
		setKeysPressed((prevKeys) => ({ ...prevKeys, [event.key]: false }));
	};
	
	const handlemousMove = () => {

	}
	const updatePositionOnKey = () => {
		
		if (keysPressed['ArrowUp']) {
			user.userAuthenticate.socket?.emit("paddlemove", "up")
			setTimeout(() => {}, 10)
		}
		if (keysPressed['ArrowDown']) {
			user.userAuthenticate.socket?.emit("paddlemove", "down")
			setTimeout(() => {}, 10)
		}
	};

	const handleStopSpectate = () => {
		user.userAuthenticate.socket?.emit("stopSpectate", gameId, user.userAuthenticate.id)
		setGameState(false)
		setSpectate(false)
	}

	const updatePong = (gameID: number, ballPosition: any, myName: string, myPos: any, enemyName: string, enemyPos: any , myScore: number, enemyScore: number) => {
		
		// let ConvertionFactor = PongRef.current?.getBoundingClientRect().height / 1080;
		
		// console.log("pong info update")
		// console.log("convertion factor", convertionFactor)
		//console.log("je rentre dans la function updatePong")
		setBallPos({
			x: ballPosition.x * convertionFactor,
			y: ballPosition.y * convertionFactor
		})
		setPaddlePos({
			top: myPos.top * convertionFactor,
			bottom: myPos.bottom * convertionFactor
		})
		setEnemyPaddlePos({
			top: enemyPos.top * convertionFactor,
			bottom: enemyPos.bottom * convertionFactor
		})
		setBallSize(25 * convertionFactor)
		setScoreSize(75 * convertionFactor)
		setScore({left: myScore, right: enemyScore})
		setName({left: myName, right: enemyName})
		setGameId(gameID)
		if ((myScore === 11 || enemyScore === 11))
		{
			if (spectate){
				setGameState(false)
				return;
			}
			const msg = myScore === 11 ? "Victory !" : "Defeat"
			setEndMesage({display: true, message: msg})
			setTimeout(() => {
				setEndMesage({...endMessage, display: false})
				setGameState(false);
			}, 3000)
		}
	}

	useEffect(() => {
		user.userAuthenticate.socket?.on("pongInfo", updatePong)

		return () => {
			user.userAuthenticate.socket?.off("pongInfo")
		}
	}, [BallPos, PaddlePos, EnemyPaddlePos])

	useEffect(() => {

	// 	const PongContainer = PongRef.current

	// 	if (!spectate && PongContainer)
	// 	{
	// 		PongContainer.addEventListener('mousemove', handlemousMove, true)
	// 		PongContainer.addEventListener('keydown', handleKeyDown, true);
	// 		PongContainer.addEventListener('keyup', handleKeyUp, true);
			
			const animationPaddleId = requestAnimationFrame(updatePositionOnKey);
			return () => {
	// 			PongContainer.removeEventListener('mousemove', handlemousMove, true)
	// 			PongContainer.removeEventListener('keydown', handleKeyDown, true);
	// 			PongContainer.removeEventListener('keyup', handleKeyUp, true);
				cancelAnimationFrame(animationPaddleId);
			};
		// }
		
	}, [keysPressed, PaddlePos]);
	
	useEffect(() => {

		const PongContainer = PongRef.current
		
		if (PongContainer)
			setConvertionFactor(PongContainer.getBoundingClientRect().height / 1080)

	}, [window.innerHeight, window.innerWidth, social])

	useEffect(() => {
		if (!spectate)
		{
			if (score.left > score.right)
				setBackgroundColor(colors.pongBackgroundWin)
			else if (score.left < score.right)
				setBackgroundColor(colors.pongBackgroundLoose)
			else
				setBackgroundColor(colors.pongBackgroundDraw)
		}
	}, [score])

	return (
		<Style $backgroundColor={backgroundColor} ref={PongRef}>
			{
				!endMessage.display && PongRef.current ? (
					<>
					{
						spectate &&
						<CloseButton closeFunctionAlt={handleStopSpectate} />
					}
					<Paddle Hposition={2} Vposition={(PaddlePos.bottom - (PaddlePos.bottom - PaddlePos.top) / 2)} handleKeyDown={handleKeyDown} handleKeyUp={handleKeyUp} focusPaddle={focusPaddle} setFocusPaddle={setFocusPaddle} tabIndex={spectate ? -1 : 0} />
					<Ball X={BallPos.x} Y={BallPos.y} BallSize={ballSize}/>
					<NameStyle $Hpos={10}>{Name.left}</NameStyle>
					<NameStyle $Hpos={90}>{Name.right}</NameStyle>
					{/* {spectate && <button onClick={handleStopSpectate}>Spectate</button>} */}
					{/* {spectate && <Button
						onClick={handleStopSpectate}
						type="button" fontSize={"20 px"}
						style={{width: "5%"}}
						title=""
						alt=""
					>Spectate</Button>} */}
					<Score LeftScore={score.left} RightScore={score.right} size={scoreSize}/>
					<Paddle Hposition={98} Vposition={(EnemyPaddlePos.bottom - (EnemyPaddlePos.bottom - EnemyPaddlePos.top) / 2)} tabIndex={-1} />
				</> ) :
				<ResultStyle $Hpos={50}>{endMessage.message}</ResultStyle>
			}
		</Style>
	);
}

export default Pong