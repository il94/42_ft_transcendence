import {
	AvatarResult,
	Group,
	GroupName,
	Result,
	ResultsWrapper
} from "./style"

import ScrollBar from "../../../componentsLibrary/ScrollBar"

import {
	Channel,
	User
} from "../../../utils/types"

import {
	resultSearchBarType
} from "../../../utils/status"

// Génère les résultats à afficher sous forme de sections, inclus une scrollbar si besoin
export function generateResults(results: User[] | Channel[], type: resultSearchBarType, littleResults: boolean, addFunction: any) {

	function Results() {
		return (
			<>
				{
					results.map((result, index) => (
						<Result
							key={`${type}_result` + index} // a definir
							onClick={() => {
								type === resultSearchBarType.USER ?
									addFunction(result as User)
									:
									addFunction(result.id)
							}}
							tabIndex={0}
							$index={index}
							$noAvatar={littleResults}>
							{
								!littleResults &&
								<AvatarResult src={result.avatar} />
							}
							{
								type === resultSearchBarType.USER ?
									(result as User).username
									:
									(result as Channel).name
							}
						</Result>
					))
				}
			</>
		)
	}

	return (
		<Group>
			<GroupName>
				{type}
			</GroupName>
			{
				results.length > 3 ?
					<ResultsWrapper>
						<ScrollBar>
							<Results />
						</ScrollBar>
					</ResultsWrapper>
					:
					<Results />
			}
		</Group>
	)
}
