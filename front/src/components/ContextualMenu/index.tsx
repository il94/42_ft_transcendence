import { Dispatch, MouseEvent, SetStateAction } from "react"
import { Style } from "./style"
import Section, { SectionName } from "../../componentsLibrary/Section"

type PropsPrimaryMenuContextual = {
	contextualMenuPosition: {
		left?: number,
		right?: number,
		top?: number,
		bottom?: number
	},
	displaySecondaryContextualMenu: Dispatch<SetStateAction<boolean>>,
	setSecondaryPosition: Dispatch<SetStateAction<{
		top: number,
		left: number
	}>>
}

function ContextualMenu({ contextualMenuPosition, displaySecondaryContextualMenu, setSecondaryPosition, setSecondaryContextualMenuOffset } : PropsPrimaryMenuContextual) {

	// function handleEvent(event: MouseEvent) {

	// 	const { clientX, clientY } = event
	// 	const { top, left } = contextualMenuPosition

	// 	// sert a definir si le curseur se rend sur le menu secondaire ou non
	// 	if (clientY < top || clientX < left)
	// 		displaySecondaryContextualMenu(false)
	// }

	function showSecondaryMenuContextual(event: MouseEvent<HTMLButtonElement>) {

		const sectionContainer = event.target as HTMLElement 
		
		if (sectionContainer)
		{
			if (sectionContainer.getBoundingClientRect().x > window.innerWidth)
				setSecondaryContextualMenuOffset(-180)
			else
				setSecondaryContextualMenuOffset(180)


			// const { left: leftContextual, top: topContextual } = contextualMenuPosition // position du menu contextuel
			// const bottomParent = sectionContainer.parentElement!.parentElement!.parentElement!.getBoundingClientRect().bottom // bas du composant parent (bas du game)
			
			// const topMenu = -(Math.abs(bottomParent - topContextual - secondaryHeight)) // valeur max que peut prendre le top du menu
			// const leftMenu = leftContextual + 180 < window.innerWidth / 2 ? 180 : -180 // définit si le menu secondaire s'affiche à gauche ou à droite
			
			// if (bottomParent - secondaryHeight < topContextual) // vérifie si le menu secondaire dépasserait par le bas
			// 	setSecondaryPosition({ left: leftMenu, top: topMenu })
			// else
			// 	setSecondaryPosition({ left: leftMenu, top: 0 })

			displaySecondaryContextualMenu(true)
		}

	}

	return (
		<Style
			// onMouseEnter={handleEvent}
			$left={contextualMenuPosition.left}
			$right={contextualMenuPosition.right}
			$top={contextualMenuPosition.top}
			$bottom={contextualMenuPosition.bottom}>
			<Section onMouseEnter={showSecondaryMenuContextual}>
				<SectionName>
					Invite
				</SectionName>
			</Section>
			<div onMouseEnter={() => displaySecondaryContextualMenu(false)}>
				<Section>
					<SectionName>
						Add
					</SectionName>
				</Section>
				<Section>
					<SectionName>
						Contact
					</SectionName>
				</Section>
				<Section>
					<SectionName>
						Challenge
					</SectionName>
				</Section>
				<Section>
					<SectionName>
						Block
					</SectionName>
				</Section>
				<Section>
					<SectionName>
						Delete
					</SectionName>
				</Section>	
			</div>
		</Style>
	)
}

export default ContextualMenu