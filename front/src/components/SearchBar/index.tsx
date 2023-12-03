import { useEffect, useState } from "react"
import Select from "react-select"
import axios from "axios"

import { Style, StylesAttributes } from "./style"

import { SearchBarOption, User } from "../../utils/types"

function SearchBar() {

	const [userOptions, setUserOptions] = useState<SearchBarOption[]>([]);
	const [channelOptions, setChannelOptions] = useState<SearchBarOption[]>([]);

	const options = [
		{ label: 'users', options: userOptions},
		{ label: 'channels', options: channelOptions}
	]

	useEffect(() => {
		axios.get("http://localhost:3333/user")
			.then((response) => {

				setUserOptions(response.data.map((user: User) => ({
					id: user.id,
					value: user.username,
					label: user.username,
					type: "user"
				})))
			})
			.catch((error) => console.log(error))
		
		// axios.get("http://localhost:3333/channels")
		// .then((response) => {

		// 	setChannelOptions(response.data.map((channel: Channel) => ({
		// 		id: channel.id,
		// 		value: channel.name,
		// 		label: channel.name,
		// 		type: "channel"
		// 	})))
		// })
		// .catch((error) => console.log(error))
		
		setChannelOptions([
			{ id: 150 ,value: 'public', label: 'public', type: 'channel' },
			{ id: 151 ,value: 'protect', label: 'protect', type: 'channel' },
			{ id: 152 ,value: 'protect', label: 'private', type: 'channel' },
		])

	}, [])

	function addFriendOrJoinChannel(option: any) {

		if (option?.type === "user")
		{
			/* ============ Temporaire ============== */

			// Ajouter un Ami dans la liste d'amis du User avec un truc du style
			// axios.post("http://localhost:3333/addfriend/:id") // id etant option.id
	
			/* ============================================== */
		}
		else if (option?.type === "channel")
		{
			/* ============ Temporaire ============== */

			// Ajouter un Channel dans la liste de channels User avec un truc du style
			// axios.post("http://localhost:3333/addchannel/:id") // id etant option.id
	
			/* ============================================== */
		}
	}

	return (
		<Style>
			<Select
				onChange={addFriendOrJoinChannel}
				placeholder={"Search..."}
				options={options}
				styles={StylesAttributes} />
		</Style>
	)
}

export default SearchBar