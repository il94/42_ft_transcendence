import { Style } from "./style"
import { CardContext } from "../../pages/Game"
import { useContext } from "react"

function Card() {

	const { cardPosition } = useContext(CardContext)!

	return (
		<Style $top={cardPosition} />
	)
}

export default Card