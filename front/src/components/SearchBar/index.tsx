import Select from "react-select"
import styled from "styled-components"
import colors from "../../utils/colors"

const Style = styled.div`

	width: 90%;

`

const options = [
	{ value: 'chocolate', label: 'Il' },
	{ value: 'faut', label: 'Faut' },
	{ value: 'mettre', label: 'Mettre' },
	{ value: 'des', label: 'Des' },
	{ value: 'trucs', label: 'Trucs' },
	{ value: 'un', label: 'Un' },
	{ value: 'jour', label: 'Jour' },
	{ value: 'peut etre', label: 'Peut etre' }
]

function SearchBar() {
	return (
		<Style>
			<Select
				placeholder={"Search..."}
				options={options}
				styles={{
					// La barre en elle-meme
					control: (props) => ({
						...props,
						border: "none",
						backgroundColor: `${colors.section}`
					}),

					// Le texte affiche par defaut
					placeholder: (props) => ({
						...props,
						color: `${colors.text}`
					}),

					// Le texte ecrit par l'utilisateur
					input: (props) => ({
						...props,
						color: `${colors.text}`
					}),

					// L'option selectionnee
					singleValue: (props) => ({
						...props,
						color: `${colors.text}`
					}),

					// Les resultats de la recherche
					option: (props, state) => ({
						...props,
						color: `${colors.text}`,
						backgroundColor: `${state.isFocused ? colors.sectionHover : colors.section}`
					}),

					// Le conteneur des options
					menuList: (props) => ({
						...props,
						color: `${colors.text}`,
						backgroundColor: `${colors.section}`
					}),

					// Le resultat affiche si aucune correspondance
					noOptionsMessage: (props) => ({
						...props,
						color: `${colors.text}`
					}),

					// Le bouton avec la fleche
					dropdownIndicator: (props) => ({
						...props,
						color: `${colors.text}`,
						backgroundColor: `${colors.sectionAlt}`
					}),

					// Le separateur du champ texte et du bouton
					indicatorSeparator: (props) => ({
						...props,
						display: "none"
					})
				}}
			/>
		</Style>
	)
}

export default SearchBar