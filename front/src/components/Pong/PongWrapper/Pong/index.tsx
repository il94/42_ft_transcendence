import  {useState, useEffect, KeyboardEvent, useRef, useContext, Dispatch, SetStateAction } from 'react'

import styled from 'styled-components'
import Paddle from './Paddle'
import Ball from './Ball'
import Score from './Score'
import InteractionContext from "../../../../contexts/InteractionContext"
import { User } from '../../../../utils/types'
import effects from '../../../../utils/effects'
import colors from '../../../../utils/colors'


const Style = styled.div<{ $backgroundColor: string }>`

position: absolute;

width: 95%;
/* height: 95%; */
aspect-ratio: 16/9;

max-width: 100%;
max-height: 100%;



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

type PongProps = {
	score: {
		left: number, right: number
	},
	setScore: Dispatch<SetStateAction<{
		left: number,
		right: number
	}>>,
	social: any;
	enemy: User | undefined;
}

function Pong({score, setScore, social, enemy}: PongProps){
	
	const user = useContext(InteractionContext)!																// !!!! object pour les sockets

	const PongRef = useRef<HTMLDivElement | null>(null)
	const [PongBounds, setPongBounds] = useState<DOMRect | undefined>(undefined)
	const [backgroundColor, setBackgroundColor] = useState<string>(colors.pongBackground)
	
	// const [players, setPlayers] = useState<{left: Socket, }>

	// const [gameState, setGameState] = useState<status>(status.SOLO)											// neum moyen ilyes a mieux

	const [PaddlePos, setPaddlePos] = useState<{top: number, bottom: number}>({top: 0, bottom: 0}) //en px
	const [EnemyPaddlePos, setEnemyPaddlePos] = useState<{top: number, bottom: number}>({top: 0, bottom: 0})
	
	const [ballSize, setBallSize] = useState(20);

	const [BallPos, setBallPos] = useState ({x: 0, y: 0});

	// const [score, setScore] = useState<{left: number, right: number}>({left: 0, right: 0})

	const [keysPressed, setKeysPressed] = useState<{ [key: string]: boolean }>({}); //tableau de key,    enfoncer = true; else false

	
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

	const updatePong = (ballPosition: any, myPos:any, enemyPos:any , myScore: number, enemyScore: number) => {
		
		if (!PongRef.current?.getBoundingClientRect())
		return ;
		
		let ConvertionFactor = PongRef.current?.getBoundingClientRect().height / 1080;

		//console.log("je rentre dans la function updatePong")
		setBallPos({
			x: ballPosition.x * ConvertionFactor,
			y: ballPosition.y * ConvertionFactor
		})
		setPaddlePos({
			top: myPos.top * ConvertionFactor,
			bottom: myPos.bottom * ConvertionFactor
		})
		setEnemyPaddlePos({
			top: enemyPos.top * ConvertionFactor,
			bottom: enemyPos.bottom * ConvertionFactor
		})
		setBallSize(25 * ConvertionFactor)
		setScore({left: myScore, right: enemyScore})
	}

	useEffect(() => {
		user.userAuthenticate.socket?.on("pongInfo", updatePong)

		return () => {
			user.userAuthenticate.socket?.off("pongInfo")
		}
	}, [BallPos, PaddlePos, EnemyPaddlePos])

	useEffect(() => {
		
		document.addEventListener('keydown', handleKeyDown, true);
		document.addEventListener('keyup', handleKeyUp, true);
		
		const animationPaddleId = requestAnimationFrame(updatePositionOnKey);
		
		return () => {
			document.removeEventListener('keydown', handleKeyDown, true);
			document.removeEventListener('keyup', handleKeyUp, true);
			cancelAnimationFrame(animationPaddleId);
		};
		
	}, [keysPressed, PaddlePos]);

	useEffect(() => {
		
		if(PongRef.current)
			setPongBounds(PongRef.current?.getBoundingClientRect())

		user.userAuthenticate.socket?.on("pongInfo", updatePong)
		user.userAuthenticate.socket?.emit("getPongInfo")
		return () => {
			user.userAuthenticate.socket?.off("pongInfo")
		}
	}, [])		
	
	useEffect(() => {
		if (score.left > score.right)
			setBackgroundColor(colors.pongBackgroundWin)
		else if (score.left < score.right)
			setBackgroundColor(colors.pongBackgroundLoose)
		else
			setBackgroundColor(colors.pongBackgroundDraw)
	}, [score])


	return (
		<Style $backgroundColor={backgroundColor} ref={PongRef}>
			{
					PongRef.current ? (
					<>
					<Paddle Hposition={2} Vposition={(PaddlePos.bottom - (PaddlePos.bottom - PaddlePos.top) / 2)}/>
					<Ball X={BallPos.x} Y={BallPos.y} BallSize={ballSize}/>
					<Score LeftScore={score.left} RightScore={score.right}/>
					<Paddle Hposition={98} Vposition={(EnemyPaddlePos.bottom - (EnemyPaddlePos.bottom - EnemyPaddlePos.top) / 2)}/>
				</> ) :
				<div>PRESS ENTER TO PLAY</div>
			}
		</Style>
	);
}

export default Pong