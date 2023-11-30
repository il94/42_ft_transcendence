import {
	Dispatch,
	RefObject,
	SetStateAction,
	useEffect,
	useRef,
	useState
} from "react"

import { Style } from "./style"

import PrimaryContextualMenu from "./PrimaryMenuContextual"
import SecondaryContextualMenu from "./SecondaryMenuContextual"

type PropsContextualMenu = {
	contextualMenuPosition: {
		top: number,
		left: number
	},
	displayContextualMenu: Dispatch<SetStateAction<boolean>>
}

function ContextualMenu({ contextualMenuPosition, displayContextualMenu } : PropsContextualMenu) {

	const ContextualMenuRef: RefObject<HTMLDivElement> = useRef(null)

	const [secondary, displaySecondary] = useState<boolean>(false)
	const [secondaryPosition, setSecondaryPosition] = useState<{ top: number; left: number}>({ top: 0, left: 0 })
	const [secondaryHeight, setSecondaryHeight] = useState<number>(0)

	useEffect(() => {
		if (ContextualMenuRef.current)
			ContextualMenuRef.current.focus()
	}, [])

	return (
		<Style onBlur={() => displayContextualMenu(false)}
				$top={contextualMenuPosition.top} $left={contextualMenuPosition.left}
				tabIndex={0} ref={ContextualMenuRef}>
			<PrimaryContextualMenu
				contextualMenuPosition={contextualMenuPosition}
				displaySecondary={displaySecondary}
				setSecondaryPosition={setSecondaryPosition}
				secondaryHeight={secondaryHeight} />
			<SecondaryContextualMenu
				secondary={secondary}
				secondaryPosition={secondaryPosition}
				displaySecondary={displaySecondary}
				setSecondaryHeight={setSecondaryHeight} />
		</Style>
	)
}

export default ContextualMenu