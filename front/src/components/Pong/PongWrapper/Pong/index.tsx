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


const Style = styled.div<{ $backgroundColor: string }>`

position: absolute;

width: 83.5%; //83.5%

/* min-width: 95%; */
/* height: 95%; */
aspect-ratio: 16/9;



// ICI


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

	font-size:${10}px;

	top: 10%;
	left: ${(props) => props.$Hpos}%;

	transform: translate(-50%, -50%);

	color: white;

`

const SpectateButton = styled.div`
	
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

function Pong({score, setScore, setGameState, setSpectate, spectate, social}: PongProps){
	
	const user = useContext(InteractionContext)!																// !!!! object pour les sockets

	const PongRef = useRef<HTMLDivElement | null>(null)
	// const [PongBounds, setPongBounds] = useState<DOMRect | undefined>(undefined)
	const [backgroundColor, setBackgroundColor] = useState<string>(colors.pongBackground)
	
	// const [players, setPlayers] = useState<{left: Socket, }>

	// const [gameState, setGameState] = useState<status>(status.SOLO)											// neum moyen ilyes a mieux

	const [PaddlePos, setPaddlePos] = useState<{top: number, bottom: number}>({top: 0, bottom: 0}) //en px
	const [EnemyPaddlePos, setEnemyPaddlePos] = useState<{top: number, bottom: number}>({top: 0, bottom: 0})

	const [Name, setName] = useState<{left: string, right: string}>({left: "", right: ""})
	
	const [ballSize, setBallSize] = useState(25);
	const [scoreSize, setScoreSize] = useState(75);

	const [gameId, setGameId] = useState(0)
	const [BallPos, setBallPos] = useState ({x: 0, y: 0});

	// const [score, setScore] = useState<{left: number, right: number}>({left: 0, right: 0})

	const [keysPressed, setKeysPressed] = useState<{ [key: string]: boolean }>({}); //tableau de key,    enfoncer = true; else false

	const [endMessage, setEndMesage] = useState<{display: boolean, message: string}>({display: false, message: "hihi"})

	const handleKeyDown = (event: KeyboardEvent) => {
		
		event.preventDefault();
		event.stopPropagation();
		
		setKeysPressed((prevKeys) => ({ ...prevKeys, [event.key]: true }));
	};
	
	const handleKeyUp = (event: KeyboardEvent) => {
		event.preventDefault();
		event.stopPropagation();
		
		setKeysPressed((prevKeys) => ({ ...prevKeys, [event.key]: false }));
	};
	
	const updatePositionOnKey = () => {
	
		let ConvertionFactor: number = 0;
		let move: number = 0;
		
		if (!PongRef.current?.getBoundingClientRect())
			return

		ConvertionFactor = PongRef.current.getBoundingClientRect().height / 1080; // 1080 = base of pong in back
		move = 10.8 * ConvertionFactor
		
		if (keysPressed['ArrowUp']) {
			user.userAuthenticate.socket?.emit("paddlemove", "up")
		}
		if (keysPressed['ArrowDown']) {
			user.userAuthenticate.socket?.emit("paddlemove", "down")
		}
	};

	const handleStopSpectate = () => {
		user.userAuthenticate.socket?.emit("stopSpectate", gameId, user.userAuthenticate.id)
		setGameState(false)
		setSpectate(false)
	}

	const [convertionFactor, setConvertionFactor] = useState<number>(0)

	useEffect(() => {

		const PongContainer = PongRef.current
		
		if (PongContainer)
			setConvertionFactor(PongContainer.getBoundingClientRect().height / 1080)

	}, [window.innerHeight, window.innerWidth, social])


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
		if ((myScore === 11 || enemyScore === 11) && !spectate)
		{
			const msg = myScore === 11 ? "Victory !" : "Defeat"
			setEndMesage({display: true, message: msg})
			setTimeout(() => {
				setEndMesage({...endMessage, display: false})
				setGameState(false);
			}, 3000)
			// setTimeout(() => {
			// }, 1000);
		}
	}

	useEffect(() => {
		user.userAuthenticate.socket?.on("pongInfo", updatePong)

		return () => {
			user.userAuthenticate.socket?.off("pongInfo")
		}
	}, [BallPos, PaddlePos, EnemyPaddlePos])

	useEffect(() => {
		
		if (!spectate)
		{
			document.addEventListener('keydown', handleKeyDown, true);
			document.addEventListener('keyup', handleKeyUp, true);
			
			const animationPaddleId = requestAnimationFrame(updatePositionOnKey);
			
			return () => {
				document.removeEventListener('keydown', handleKeyDown, true);
				document.removeEventListener('keyup', handleKeyUp, true);
				cancelAnimationFrame(animationPaddleId);
			};
		}
		
	}, [keysPressed, PaddlePos]);

	useEffect(() => {
	}, [])		
	
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
					<Paddle Hposition={2} Vposition={(PaddlePos.bottom - (PaddlePos.bottom - PaddlePos.top) / 2)}/>
					<Ball X={BallPos.x} Y={BallPos.y} BallSize={ballSize}/>
					<NameStyle $Hpos={10}>{Name.left}</NameStyle>
					<NameStyle $Hpos={90}>{Name.right}</NameStyle>
					{/* {spectate && <button onClick={handleStopSpectate}>Spectate</button>} */}
					{spectate && <Button
						onClick={handleStopSpectate}
						type="button" fontSize={"5.5vw"}
						style={{width: "5%"}}
						title="spectate"
						alt=""
					>Spectate</Button>}
					<Score LeftScore={score.left} RightScore={score.right} size={scoreSize}/>
					<Paddle Hposition={98} Vposition={(EnemyPaddlePos.bottom - (EnemyPaddlePos.bottom - EnemyPaddlePos.top) / 2)}/>
				</> ) :
				<p style={{fontSize:"10vw", top:"50%", left: "50%"}}>{endMessage.message}</p>
			}
		</Style>
	);
}

export default Pong