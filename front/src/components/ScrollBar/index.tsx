import { ReactNode } from "react"
import { Scrollbars } from "react-custom-scrollbars"
import styled from "styled-components"
import colors from "../../utils/colors"

const ThumbVertical = styled.div`

	background-color: ${colors.scrollingBarTransparent};

`

const TrackVertical = styled.div`

	position: absolute;
	right: 0px;

	width: 5px;
	height: 100%;

`

function ScrollBar({ children } : { children: ReactNode }) {

	return (
		<Scrollbars
			renderThumbVertical={() => <ThumbVertical />}
			renderTrackVertical={() => <TrackVertical />}>
			{ children }
		</Scrollbars>
	)
}

export default ScrollBar