import { useContext } from "react"
import styled from "styled-components"
import Chat from "../Chat"
import ChatButton from "../Chat/ChatButton"
import Card from "../Card"
import { CardContext, ChatContext } from "../../pages/Game"

const Style = styled.div`

	position: relative;

	width: 100%;
	height: 100%;

	background-color: #FD994F;

`

function Pong() {
	
	const { card } = useContext(CardContext)!
	const { chat } = useContext(ChatContext)!

	return (
		<Style>
			{
				card && <Card />
			}
			{
				chat ?
					<Chat />
					:
					<ChatButton />
			}
		</Style>
	)
}

export default Pong