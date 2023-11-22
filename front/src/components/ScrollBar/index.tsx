import React, { ReactNode, SetStateAction, UIEvent, useEffect, useRef, useState } from "react"
import { Scrollbars } from "react-custom-scrollbars"
import styled from "styled-components"
import colors from "../../utils/colors"

const ThumbVertical = styled.div`

	background-color: ${colors.scrollingBarTransparent};

`

const TrackVertical = styled.div<{$onMouse: boolean}>`

	display: ${(props) => props.$onMouse ? "block" : "none" };

	position: absolute;
	right: 0px;

	width: 5px;
	height: 100%;

`

function ScrollBar({ state, firstRenderState, children }
		: { state: { value: number, setter: React.Dispatch<SetStateAction<number>> },
			firstRenderState: { value: boolean, setter: React.Dispatch<SetStateAction<boolean>> },
			children: ReactNode } ) {

	const scrollBarRef = useRef<Scrollbars>(null)
	const [onMouse, setOnMouse] = useState<boolean>(false)

	useEffect(() => {
		if (scrollBarRef.current)
		{
			setFirstPosition()
			setCurrentPosition()
		}
	}, [])

	function setFirstPosition() {
		if (firstRenderState && !firstRenderState.value)
		{
			scrollBarRef.current!.scrollToBottom()
			firstRenderState.setter(true)
		}
	}

	function setCurrentPosition() {
		if (state && state.value)
			scrollBarRef.current!.scrollTop(state.value)
	}

	function handleScrollPosition(event: UIEvent) {
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
			{ children }
		</Scrollbars>
	)
}

export default ScrollBar