import { Dispatch, MouseEvent, SetStateAction } from "react"
import { Style } from "./style"
import SectionName from "../../../../componentsLibrary/SectionName/SectionName"
import Section from "../../../../componentsLibrary/Section"

type PropsPrimaryMenuContextual = {
	position: {
		top: number,
		left: number
	},
	displaySecondary: Dispatch<SetStateAction<boolean>>,
	setSecondaryPosition: Dispatch<SetStateAction<number>>,
	secondaryHeight: number
}

function PrimaryMenuContextual({ position, displaySecondary, setSecondaryPosition, secondaryHeight } : PropsPrimaryMenuContextual) {

	function handleEvent(event: MouseEvent) {

		const { clientX, clientY } = event
		const { left, top } = position

		// sert a definir si le curseur se rend sur le menu secondaire ou non
		if (clientX < left || clientY < top)
			displaySecondary(false)
	}

	function showSecondaryMenuContextual(event: MouseEvent<HTMLButtonElement>) {

		const sectionContainer = event.target as HTMLElement 
		
		if (sectionContainer)
		{
			const target = position.top // position du clic sur l'axe Y

			const bottomParent = sectionContainer.parentElement!.parentElement!.parentElement!.getBoundingClientRect().bottom // bas du composant parent (bas du game)
			
			const topMenu = -(Math.abs(bottomParent - target - secondaryHeight)) // valeur max que peut prendre le top du menu
			
			if (bottomParent - secondaryHeight < target)
				setSecondaryPosition(topMenu)
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