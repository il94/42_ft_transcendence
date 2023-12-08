import { Dispatch, MouseEvent, SetStateAction, useEffect, useRef } from "react"
import { Style } from "./style"
import Section, { SectionName } from "../../componentsLibrary/Section"

type PropsPrimaryMenuContextual = {
	type: string,
	displayContextualMenu: Dispatch<SetStateAction<{
		display: boolean,
		type: string
	}>>,
	contextualMenuPosition: {
		left?: number,
		right?: number,
		top?: number,
		bottom?: number
	},
	displaySecondaryContextualMenu: Dispatch<SetStateAction<boolean>>,
	setSecondaryContextualMenuPosition: Dispatch<SetStateAction<{
		left?: number,
		right?: number,
		top?: number,
		bottom?: number
	}>>,
	secondaryContextualMenuHeight: number
}

function ContextualMenu({ type, displayContextualMenu, contextualMenuPosition, displaySecondaryContextualMenu, setSecondaryContextualMenuPosition, secondaryContextualMenuHeight } : PropsPrimaryMenuContextual) {

	function closeContextualMenus() {
		displayContextualMenu({ display: false, type: '' })
		displaySecondaryContextualMenu(false)
	}

	const ContextualMenuRef = useRef<HTMLDivElement>(null)
	useEffect(() => {
		const ContextualMenuContainer = ContextualMenuRef.current
		if (ContextualMenuContainer)
			ContextualMenuContainer.focus()
	})

	function showSecondaryMenuContextual(event: MouseEvent<HTMLButtonElement>) {

		const inviteSectionContainer = event.target as HTMLElement 
		
		if (inviteSectionContainer)
		{
			const horizontalBorder = window.innerHeight * 5 / 100 // height des bordures horizontales autour du jeu
			const maxBottom = window.innerHeight - horizontalBorder - secondaryContextualMenuHeight // valeur max avant que le menu ne depasse par le bas
			const { x: leftMenu, y: topMenu } = inviteSectionContainer.getBoundingClientRect() // position du menu principal

			const offsetX = leftMenu < window.innerWidth ? 180 : -180 // determine de quel cote le menu secondaire doit etre decale par rapport a la position du menu principal
			let offsetY = 0 // decalage vertical par defaut du menu secondaire si il ne depasse pas
			
			if (topMenu - horizontalBorder / 2 > maxBottom) // verifie si le menu secondaire depasse sur l'axe vertical
				offsetY = maxBottom - (topMenu - horizontalBorder / 2) // ajuste le resultat vertical

			setSecondaryContextualMenuPosition({
				left: contextualMenuPosition.left && contextualMenuPosition.left + offsetX,
				right: contextualMenuPosition.right && contextualMenuPosition.right + offsetX,
				top: contextualMenuPosition.top && contextualMenuPosition.top + offsetY,
				bottom: contextualMenuPosition.bottom && contextualMenuPosition.bottom + offsetY

			})
			displaySecondaryContextualMenu(true)
		}

	}

	return (
		<Style
			onBlur={closeContextualMenus}
			$left={contextualMenuPosition.left}
			$right={contextualMenuPosition.right}
			$top={contextualMenuPosition.top}
			$bottom={contextualMenuPosition.bottom}
			tabIndex={0}
			ref={ContextualMenuRef}>
			<Section onMouseEnter={showSecondaryMenuContextual}>
				<SectionName>
					Invite
				</SectionName>
			</Section>
			<div onMouseEnter={() => displaySecondaryContextualMenu(false)}>
			{
				type === "chat" &&
				<Section>
					<SectionName>
						Add
					</SectionName>
				</Section>
			}
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