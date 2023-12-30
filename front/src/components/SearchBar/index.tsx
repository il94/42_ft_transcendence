import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react"
import Select from "react-select"
import axios from "axios"

import { Style, StylesAttributes } from "./style"

import InteractionContext from "../../contexts/InteractionContext"
import ErrorRequest from "../../componentsLibrary/ErrorRequest"

import { ChannelData, User } from "../../utils/types"
import { channelStatus, userStatus } from "../../utils/status"

import DefaultChannelPicture from "../../assets/default_channel.png"
import TontonPicture from "../../assets/xavier_niel.webp"

type PropsSearchBar = {
	displayChat: Dispatch<SetStateAction<boolean>>
}

function SearchBar({ displayChat }: PropsSearchBar) {

	const { userAuthenticate, userTarget, setUserTarget, setChannelTarget } = useContext(InteractionContext)!

	const [errorRequest, setErrorRequest] = useState<boolean>(false)

	enum optionType {
		USER,
		CHANNEL
	}

	type Option = {
		label: string,
		optionType: optionType
	}

	type UserOption = Option & {
		user: User
	}
	type ChannelOption = Option & {
		channel: ChannelData
	}

	const [userOptions, setUserOptions] = useState<UserOption[]>([]);
	const [channelOptions, setChannelOptions] = useState<ChannelOption[]>([]);

	function getRandomStatus() {
		const status = [
			userStatus.ONLINE,
			userStatus.OFFLINE,
			userStatus.PLAYING,
			userStatus.WAITING,
			userStatus.WATCHING
		]

		/* ====================================== */

		const randomStatus = Math.floor(Math.random() * 5)

		return (status[randomStatus])
	}

	useEffect(() => {
		async function fetchUsersAndChannels() {
			try {
				const users = await axios.get("http://localhost:3333/user")

				setUserOptions(users.data.map((user: User) => ({
					user: {
						...user ,
						status: getRandomStatus(),
						scoreResume: {
							wins: 0,
							draws: 0,
							looses: 0
						}
					},
					label: user.username,
					optionType: optionType.USER,
				})))

				/* ============ Temporaire ============== */

				// const channels = await axios.get("http://localhost:3333/channel")

				const tempResponse: ChannelData[] = [
					{
						id: 0,
						name: "Public 1",
						avatar: DefaultChannelPicture,
						type: channelStatus.PUBLIC,
						messages: [],
						owner: userAuthenticate,
						administrators: [
							userAuthenticate
						],
						users: [
							userAuthenticate,
							userTarget
						],
						validUsers: [
							userAuthenticate
						],
						mutedUsers: [],
						bannedUsers: []
					},
					{
						id: 1,
						name: "Public 2",
						avatar: DefaultChannelPicture,
						type: channelStatus.PUBLIC,
						messages: [],
						owner: userTarget,
						administrators: [
							userTarget
						],
						users: [
							userTarget,
							userAuthenticate
						],
						validUsers: [
							userTarget
						],
						mutedUsers: [],
						bannedUsers: []
					},
					{
						id: 2,
						name: "Protect 1",
						avatar: DefaultChannelPicture,
						type: channelStatus.PROTECTED,
						password: "password",
						messages: [],
						owner: userAuthenticate,
						administrators: [
							userAuthenticate
						],
						users: [
							userAuthenticate,
							userTarget
						],
						validUsers: [
							userAuthenticate
						],
						mutedUsers: [],
						bannedUsers: []
					},
					{
						id: 3,
						name: "Protect 2",
						avatar: DefaultChannelPicture,
						type: channelStatus.PROTECTED,
						password: "password",
						messages: [],
						owner: userTarget,
						administrators: [
							userTarget
						],
						users: [
							userTarget,
							userAuthenticate
						],
						validUsers: [
							userTarget
						],
						mutedUsers: [],
						bannedUsers: []
					},
					{
						id: 4,
						name: "Private",
						avatar: DefaultChannelPicture,
						type: channelStatus.PRIVATE,
						messages: [],
						owner: userAuthenticate,
						administrators: [
							userAuthenticate
						],
						users: [
							userAuthenticate,
							userTarget
						],
						validUsers: [
							userAuthenticate
						],
						mutedUsers: [],
						bannedUsers: []
					},
					{
						id: 5,
						name: "MP",
						avatar: TontonPicture,
						type: channelStatus.MP,
						messages: [],
						owner: userTarget,
						administrators: [
							userTarget
						],
						users: [
							userTarget,
							userAuthenticate
						],
						validUsers: [
							userTarget
						],
						mutedUsers: [],
						bannedUsers: []
					}
				]

				/* ============================================== */

				setChannelOptions(tempResponse.filter((channel: ChannelData) => (
					channel.type !== channelStatus.PRIVATE && channel.type !== channelStatus.MP
				)).map((channel: ChannelData) => ({
					channel: { ...channel },
					label: channel.name,
					optionType: optionType.CHANNEL
				})))
			}
			catch (error) {
				setErrorRequest(true)
			}
		}
		fetchUsersAndChannels()
	}, [])

	async function addFriendOrJoinChannel(option: UserOption | ChannelOption | any) {
		try {
			if (option.optionType === optionType.USER && !userAuthenticate.friends.includes(option.user))
			{
				/* ============ Temporaire ============== */

				// axios.post("http://localhost:3333/user/me/friends/${option.user.id}") 

				/* ============================================== */

				setUserTarget(option.user)
				userAuthenticate.friends.push(option.user)
			}
			else if (option.optionType === optionType.CHANNEL && !option.channel.users.includes(userAuthenticate)) {
				/* ============ Temporaire ============== */

				// axios.post("http://localhost:3333/user/me/channels/${option.channel.id")

				/* ============================================== */

				setChannelTarget(option.channel)
				option.channel.users.push(userAuthenticate)
				userAuthenticate.channels.push(option.channel)
				displayChat(true)
			}
		}
		catch (error) {
			setErrorRequest(true)
		}
	}

	const options = [
		{
			label: 'users',
			options: userOptions
		},
		{
			label: 'channels',
			options: channelOptions
		}
	]

	return (
		<Style>
			{
				!errorRequest ?
					<Select
						onChange={addFriendOrJoinChannel}
						placeholder={"Search..."}
						options={options}
						styles={StylesAttributes} />
					:
					<ErrorRequest />
			}
		</Style>
	)
}

export default SearchBar