import {
	useEffect,
	useRef,
	useState,
	ReactNode,
	UIEvent,
	SetStateAction,
	Dispatch,
	Children
} from "react"

import { Scrollbars } from "react-custom-scrollbars"

import styled from "styled-components"
import colors from "../../utils/colors"

const View = styled.div`

	position: absolute;

	inset: 0px;
	
	overflow-y: scroll;
	overflow-x: hidden;

	margin-right: -15px;

`

const ThumHorizontal = styled.div`

	display: none;
	
`

const TrackHorizontal = styled.div`

	display: none;
	
`

const ThumbVertical = styled.div<{ $visible?: boolean }>`

	margin: 0;
	margin-bottom: 0;
	padding: 0;
	padding-bottom: 0;
	
	background-color: ${colors.scrollingBarTransparent};

`

const TrackVertical = styled.div<{ $onMouse: boolean, $visible?: boolean }>`

	display: ${(props) => (props.$onMouse || props.$visible) ? "block" : "none"};

	position: absolute;
	right: 0px;

	width: 5px;
	height: 100%;

	margin: 0;
	margin-bottom: 0;
	padding: 0;
	padding-bottom: 0;

`

type PropsScrollBar = {
	state?: {
		value: number,
		setter: Dispatch<SetStateAction<number>>
	},
	firstRenderState?: {
		value: boolean,
		setter: Dispatch<SetStateAction<boolean>>
	},
	activeState?: boolean,
	visible?: boolean,
	children: ReactNode
}

function ScrollBar({ state, firstRenderState, activeState, visible, children }: PropsScrollBar) {

	const scrollBarRef = useRef<Scrollbars>(null)
	const [onMouse, setOnMouse] = useState<boolean>(false)

	useEffect(() => {
		if (scrollBarRef.current) {
			setFirstPosition()
			setCurrentPosition()
		}
	}, [])

	useEffect(() => { // Met a jour la position de la scrollbar a chaque changements
		if (activeState && scrollBarRef.current)
			scrollBarRef.current!.scrollToBottom()
	}, [Children.count(children)])

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
			renderThumbVertical={() => <ThumbVertical $visible={visible} />}
			renderTrackVertical={() => <TrackVertical $onMouse={onMouse} $visible={visible} />}
			renderThumbHorizontal={() => <ThumHorizontal />}
			renderTrackHorizontal={() => <TrackHorizontal />}
			renderView={() => <View />}>
			{children}
		</Scrollbars>
	)
}

export default ScrollBar