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
	displayContextualMenu: Dispatch<SetStateAction<boolean>>
}

function MenuContextual({ position, displayContextualMenu } : PropsMenuContextual) {

	const menuContextualRef: RefObject<HTMLDivElement> = useRef(null)

	const [secondary, displaySecondary] = useState<boolean>(false)
	const [secondaryPosition, setSecondaryPosition] = useState<number>(0)
	const [secondaryHeight, setSecondaryHeight] = useState<number>(0)


	useEffect(() => {
		if (menuContextualRef.current)
			menuContextualRef.current.focus()
	}, [])

	return (
		<Style onBlur={() => displayContextualMenu(false)}
				$top={position.top} $left={position.left}
				tabIndex={0} ref={menuContextualRef}>
			<PrimaryMenuContextual
				position={position}
				displaySecondary={displaySecondary}
				setSecondaryPosition={setSecondaryPosition}
				secondaryHeight={secondaryHeight} />
			<SecondaryMenuContextual
				secondary={secondary}
				secondaryPosition={secondaryPosition}
				displaySecondary={displaySecondary}
				setSecondaryHeight={setSecondaryHeight} />
		</Style>
	)
}

export default MenuContextual