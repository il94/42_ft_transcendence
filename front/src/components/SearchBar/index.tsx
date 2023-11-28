import Select from "react-select"
import styled from "styled-components"

import colors from "../../utils/colors"
import effects from "../../utils/effects"

const Style = styled.div`

	width: 90%;

	font-size: 14.5px;

`

const userOptions = [
	{ value: 'ilandols', label: 'ilandols' },
	{ value: 'sbelabba', label: 'sbelabba' },
	{ value: 'cchapon', label: 'cchapon' },
	{ value: 'adouay', label: 'adouay' }
]

const channelOptions = [
	{ value: 'public', label: 'public' },
	{ value: 'protect', label: 'protect' },
	{ value: 'protect', label: 'private' },
]

const groupOptions = [
	{ label: 'users', options: userOptions},
	{ label: 'channels', options: channelOptions}
]

function SearchBar() {
	return (
		<Style>
			<Select
				placeholder={"Search..."}
				options={groupOptions}
				styles={{
					
					// La barre en elle-meme
					control: (props) => ({
						...props,

						border: "none",
						boxShadow: "none",
						
						clipPath: effects.pixelateWindow,

						backgroundColor: colors.section
					}),

					// La partie gauche de la barre (input donc)
					valueContainer: (props) => ({
						...props,

						cursor: "text",
					}),

					// Le texte affiche par defaut
					placeholder: (props) => ({
						...props,

						color: colors.text
					}),

					// Le texte ecrit par l'utilisateur
					input: (props) => ({
						...props,
						
						color: colors.text
					}),

					// L'option selectionnee affichee dans la barre
					singleValue: (props) => ({
						...props,
						
						color: colors.text,
					}),
					
					// Le separateur du champ texte et du bouton
					indicatorSeparator: (props) => ({
						...props,

						display: "none"
					}),

					// Le bouton avec la fleche (remplacer par une loupe si possible)
					dropdownIndicator: (props) => ({
						...props,
						
						color: colors.text, '&:hover': {
							color: colors.sectionHover
						},

						backgroundColor: colors.sectionAlt
					}),

					// Le menu en lui-meme
					menu: (props) => ({
						...props,

						boxShadow: "none",

						backgroundColor: "none"

					}),
					
					// Le conteneur des options et des groupes
					menuList: (props) => ({
						...props,

						padding: '0',

						clipPath: effects.pixelateWindow
					}),

					// Le header d'un groupe
					groupHeading: (props) => ({
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
					group: (props) => ({
						...props,

						maxHeight: "140px",

						padding: 0,

						overflowY: "hidden"
					}),

					// L'option en elle-meme
					option: (props, state) => ({
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
					noOptionsMessage: (props) => ({
						...props,

						color: colors.text
					}),

				}}
			/>
		</Style>
	)
}

export default SearchBar