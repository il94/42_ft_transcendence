import { RefObject, useContext, useEffect, useRef, useState } from "react"

import { Style } from "./style"

import PrimaryMenuContextual from "./PrimaryMenuContextual"
import SecondaryMenuContextual from "./SecondaryMenuContextual"

import MenuContextualContext from "../../contexts/MenuContextualContext"

type PropsMenuContextual = {
	position: {
		top: number,
		left: number
	}
}

function MenuContextual({ position } : PropsMenuContextual) {

	const { displayMenuContextual } = useContext(MenuContextualContext)!
	const menuInteractionRef: RefObject<HTMLDivElement> = useRef(null)

	const [secondary, displaySecondary] = useState<boolean>(false)
	const [secondaryTop, setSecondaryTop] = useState<number>(0)
	const [secondaryHeight, setSecondaryHeight] = useState<number>(0)


	useEffect(() => {
		if (menuInteractionRef.current)
			menuInteractionRef.current.focus()
	}, [])

	return (
		<Style onBlur={() => displayMenuContextual(false)}
				$top={position.top} $left={position.left}
				tabIndex={0} ref={menuInteractionRef}>
			<PrimaryMenuContextual
				position={position}
				displaySecondary={displaySecondary}
				setSecondaryTop={setSecondaryTop}
				secondaryHeight={secondaryHeight} />
			<SecondaryMenuContextual
				secondary={secondary}
				secondaryTop={secondaryTop}
				displaySecondary={displaySecondary}
				setSecondaryHeight={setSecondaryHeight} />
		</Style>
	)
}

export default MenuContextual