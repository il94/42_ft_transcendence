import styled from "styled-components"
import effects from "../../utils/effects"
import colors from "../../utils/colors"

export const Style = styled.div<{ $zIndex: number }>`

	display: flex;
	flex-direction: column;

	position: absolute;
	right: 0;
	bottom: 0;
	z-index: ${(props) => props.$zIndex};

	width: 373px;
	height: 243px;

	clip-path: ${effects.pixelateWindow};

`

export const TopChatWrapper = styled.div`
	
	display: flex;

	width: 100%;
	height: 30px;
	min-height: 30px;

`

export const ChannelCreateButton = styled.button`
	
	display: flex;
	justify-content: center;
	align-items: center;

	width: 128px;

	padding: 0;

	background-color: ${colors.buttonFix};

	&:hover {
		background-color: ${colors.buttonFixHover};
	}
	&:focus-visible {
		outline: none;	
		background-color: ${colors.buttonFixFocus};
	}

`

export const BottomChatWrapper = styled.div`
	
	display: flex;

	width: 100%;
	height: 213px;
	min-height: 213px;

`

export const Interfaces = styled.div`
	
	width: 245px;

	position: relative;

`

export const ChatButton = styled.div<{ $zIndex: number }>`

	position: absolute;
	right: 6.5px;
	bottom: 4.5px;
	z-index: ${(props) => props.$zIndex};

`