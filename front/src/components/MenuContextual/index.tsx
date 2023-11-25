import { RefObject, useContext, useEffect, useRef } from "react"
import { Section, SectionName, Style } from "./style"
import MenuContextualContext from "../../contexts/MenuContextualContext"

type PropsMenuContextual = {
	position: { top: number, left: number }
}

function MenuContextual({ position } : PropsMenuContextual) {

	const { displayMenuContextual } = useContext(MenuContextualContext)!
	const menuInteractionRef: RefObject<HTMLDivElement> = useRef(null)

	useEffect(() => {
		if (menuInteractionRef.current)
			menuInteractionRef.current.focus()
	}, [])

	return (
		<Style onBlur={() => displayMenuContextual(false)}
				$top={position.top} $left={position.left}
				tabIndex={0} ref={menuInteractionRef}>
			<Section>
				<SectionName>
					Roomer
				</SectionName>
			</Section>
			<Section>
				<SectionName>
					Défier
				</SectionName>
			</Section>
			<Section>
				<SectionName>
					Bloquer
				</SectionName>
			</Section>
			<Section>
				<SectionName>
					Supprimer
				</SectionName>
			</Section>	
		</Style>
	)
}

export default MenuContextual