import {
	useEffect,
	useRef,
	useState,
	ReactNode,
	UIEvent,
	SetStateAction,
	Dispatch
} from "react"

import { Scrollbars } from "react-custom-scrollbars"

import styled from "styled-components"
import colors from "../../utils/colors"

const ThumbVertical = styled.div`

	background-color: ${colors.scrollingBarTransparent};
	
`

const TrackVertical = styled.div<{ $onMouse: boolean }>`

	display: ${(props) => props.$onMouse ? "block" : "none"};

	position: absolute;
	right: 0px;

	width: 5px;
	height: 100%;

`

type ScrollBarProps = {
	state?: { value: number, setter: Dispatch<SetStateAction<number>> },
	firstRenderState?: { value: boolean, setter: Dispatch<SetStateAction<boolean>> },
	children: ReactNode
}

function ScrollBar({ state, firstRenderState, children }: ScrollBarProps) {

	const scrollBarRef = useRef<Scrollbars>(null)
	const [onMouse, setOnMouse] = useState<boolean>(false)

	useEffect(() => {
		if (scrollBarRef.current) {
			setFirstPosition()
			setCurrentPosition()
		}
	}, [])

	function setFirstPosition() { // Definit la position de depart de la scrollbar
		if (firstRenderState && !firstRenderState.value) {
			scrollBarRef.current!.scrollToBottom()
			firstRenderState.setter(true)
		}
	}

	function setCurrentPosition() { // Place la scrollbar a la position gardee en memoire
		if (state && state.value)
			scrollBarRef.current!.scrollTop(state.value)
	}

	function handleScrollPosition(event: UIEvent) { // Garde en memoire la position de la scrollbar
		if (state && state.setter)
			state.setter((event.target as HTMLElement).scrollTop)
	}

	return (
		<Scrollbars onMouseEnter={() => setOnMouse(true)}
					onMouseLeave={() => setOnMouse(false)}
					onScroll={handleScrollPosition}
					ref={scrollBarRef}
					renderThumbVertical={() => <ThumbVertical />}
					renderTrackVertical={() => <TrackVertical $onMouse={onMouse} />}>
			{children}
		</Scrollbars>
	)
}

export default ScrollBar