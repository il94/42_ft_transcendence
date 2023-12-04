import { Dispatch, MouseEvent, SetStateAction } from "react"
import { Style } from "./style"
import Section, { SectionName } from "../../../componentsLibrary/Section"

type PropsPrimaryMenuContextual = {
	contextualMenuPosition: {
		top: number,
		left: number
	},
	displaySecondary: Dispatch<SetStateAction<boolean>>,
	setSecondaryPosition: Dispatch<SetStateAction<{
		top: number,
		left: number
	}>>,
	secondaryHeight: number
}

function PrimaryMenuContextual({ contextualMenuPosition, displaySecondary, setSecondaryPosition, secondaryHeight } : PropsPrimaryMenuContextual) {

	function handleEvent(event: MouseEvent) {

		const { clientX, clientY } = event
		const { top, left } = contextualMenuPosition

		// sert a definir si le curseur se rend sur le menu secondaire ou non
		if (clientY < top || clientX < left)
			displaySecondary(false)
	}

	function showSecondaryMenuContextual(event: MouseEvent<HTMLButtonElement>) {

		const sectionContainer = event.target as HTMLElement 
		
		if (sectionContainer)
		{
			const { left: leftContextual, top: topContextual } = contextualMenuPosition // position du menu contextuel
			const bottomParent = sectionContainer.parentElement!.parentElement!.parentElement!.getBoundingClientRect().bottom // bas du composant parent (bas du game)
			
			const topMenu = -(Math.abs(bottomParent - topContextual - secondaryHeight)) // valeur max que peut prendre le top du menu
			const leftMenu = leftContextual + 180 < window.innerWidth / 2 ? 180 : -180 // définit si le menu secondaire s'affiche à gauche ou à droite
			
			if (bottomParent - secondaryHeight < topContextual) // vérifie si le menu secondaire dépasserait par le bas
				setSecondaryPosition({ left: leftMenu, top: topMenu })
			else
				setSecondaryPosition({ left: leftMenu, top: 0 })

			displaySecondary(true)
		}

	}

	return (
		<Style onMouseEnter={handleEvent}>
			<Section onMouseEnter={(showSecondaryMenuContextual)}>
				<SectionName>
					Invite
				</SectionName>
			</Section>
			<div onMouseEnter={() => displaySecondary(false)}>
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

export default PrimaryMenuContextual