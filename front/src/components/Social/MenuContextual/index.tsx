import {
	Dispatch,
	RefObject,
	SetStateAction,
	useEffect,
	useRef,
	useState
} from "react"

import { Style } from "./style"

import PrimaryMenuContextual from "./PrimaryMenuContextual"
import SecondaryMenuContextual from "./SecondaryMenuContextual"

type PropsMenuContextual = {
	position: {
		top: number,
		left: number
	},
	displayMenuContextual: Dispatch<SetStateAction<boolean>>
}

function MenuContextual({ position, displayMenuContextual } : PropsMenuContextual) {

	const menuContextualRef: RefObject<HTMLDivElement> = useRef(null)

	const [secondary, displaySecondary] = useState<boolean>(false)
	const [secondaryTop, setSecondaryTop] = useState<number>(0)
	const [secondaryHeight, setSecondaryHeight] = useState<number>(0)


	useEffect(() => {
		if (menuContextualRef.current)
			menuContextualRef.current.focus()
	}, [])

	return (
		<Style onBlur={() => displayMenuContextual(false)}
				$top={position.top} $left={position.left}
				tabIndex={0} ref={menuContextualRef}>
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