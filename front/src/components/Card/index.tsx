import { Style } from "./style"

function Card({ cardPosition } : { cardPosition: { top: number, left: number} }) {

	return (
		<Style $top={cardPosition.top} $left={cardPosition.left} />
	)
}

export default Card