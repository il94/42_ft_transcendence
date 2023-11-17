import { Style } from "./style"

function Card({ cardPosition } : { cardPosition: number }) {

	return (
		<Style $top={cardPosition} />
	)
}

export default Card