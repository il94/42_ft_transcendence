import styled from "styled-components"
import effects from "../../utils/effects"
import colors from "../../utils/colors"

export const Style = styled.div`

	display: flex;

	width: 368px;
	height: 243px;

	${effects.pixelateWindow};

`

export const ChatWindow = styled.div`

	display: flex;
	flex-direction: column;

	width: 66.58%;
	height: 100%;

	background-color: ${colors.chatWindow};

`

// export const Banner = styled.div`

// 	display: flex;
// 	justify-content: space-between;
// 	align-items: center;

// 	width: 100%;
// 	height: 12.35%;

// 	background-color: ${colors.chatBanner};

// `

// export const ChannelName = styled.p`

// 	width: 100%;

// 	text-align: center;

// `

// export const ReduceButton = styled.img`

// 	width: 18.11px;
// 	height: 18.11px;

// 	margin-right: 6.5px;

// 	cursor: pointer;

// 	${effects.pixelateIcon};
// 	${effects.shadowButton};


// 	border-width: 0.2em; // a definir
// 	/* border-width: 2.5px; */

// `

// export const DiscussionInterface = styled.div`

// 	display: flex;

// 	width: 100%;
// 	height: 87.65%;

// `
