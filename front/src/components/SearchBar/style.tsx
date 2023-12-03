import styled from "styled-components"
import { CSSObjectWithLabel, OptionProps } from "react-select"

import colors from "../../utils/colors"
import effects from "../../utils/effects"

export const Style = styled.div`

	width: 90%;

	font-size: 14.5px;

`

export const StylesAttributes: any = {
					
	// La barre en elle-meme
	control: (props: CSSObjectWithLabel) => ({
		...props,

		border: "none",
		boxShadow: "none",
		
		clipPath: effects.pixelateWindow,

		backgroundColor: colors.section
	}),

	// La partie gauche de la barre (input donc)
	valueContainer: (props: CSSObjectWithLabel) => ({
		...props,

		cursor: "text",
	}),

	// Le texte affiche par defaut
	placeholder: (props: CSSObjectWithLabel) => ({
		...props,

		color: colors.text
	}),

	// Le texte ecrit par l'utilisateur
	input: (props: CSSObjectWithLabel) => ({
		...props,
		
		color: colors.text
	}),

	// L'option selectionnee affichee dans la barre
	singleValue: (props: CSSObjectWithLabel) => ({
		...props,
		
		color: colors.text,
	}),
	
	// Le separateur du champ texte et du bouton
	indicatorSeparator: (props: CSSObjectWithLabel) => ({
		...props,

		display: "none"
	}),

	// Le bouton avec la fleche (remplacer par une loupe si possible)
	dropdownIndicator: (props: CSSObjectWithLabel) => ({
		...props,
		
		color: colors.text, '&:hover': {
			color: colors.sectionHover
		},

		backgroundColor: colors.sectionAlt
	}),

	// Le menu en lui-meme
	menu: (props: CSSObjectWithLabel) => ({
		...props,

		boxShadow: "none",

		backgroundColor: "none"

	}),
	
	// Le conteneur des options et des groupes
	menuList: (props: CSSObjectWithLabel) => ({
		...props,

		padding: '0',

		clipPath: effects.pixelateWindow
	}),

	// Le header d'un groupe
	groupHeading: (props: CSSObjectWithLabel) => ({
		...props,

		display: "flex",
		alignItems: "center",

		height: "35px",

		margin: '0',
		paddingLeft: "10px",

		fontSize: "16px",

		color: colors.text,
		backgroundColor: colors.sectionAlt
	}),

	// Le groupe en lui-meme
	group: (props: CSSObjectWithLabel) => ({
		...props,

		maxHeight: "140px",

		padding: 0,

		overflowY: "hidden"
	}),

	// L'option en elle-meme
	option: (props: CSSObjectWithLabel, state: OptionProps) => ({
		...props,

		paddingLeft: "20px",

		backgroundColor: state.isFocused ?
			colors.sectionHover :
			colors.section,
			'&:active': {
				backgroundColor: colors.reduceButtonHover
			}
	}),

	// Le resultat affiche si aucune correspondance
	noOptionsMessage: (props: CSSObjectWithLabel) => ({
		...props,

		color: colors.text,
		backgroundColor: colors.section
	}),

}