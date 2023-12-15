import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react"
import Select from "react-select"
import axios from "axios"

import { Style, StylesAttributes } from "./style"

import GlobalContext from "../../contexts/GlobalContext"
import ErrorRequest from "../../componentsLibrary/ErrorRequest"

import { ChannelData, User } from "../../utils/types"
import { channelStatus, chatWindowStatus } from "../../utils/status"

import DefaultChannelPicture from "../../assets/default_channel.png"
import TontonPicture from "../../assets/xavier_niel.webp"

type PropsSearchBar = {
	setChatWindowState: Dispatch<SetStateAction<chatWindowStatus>>,
	displayChat: Dispatch<SetStateAction<boolean>>
}

function SearchBar({ setChatWindowState, displayChat }: PropsSearchBar) {

	const { userAuthenticate, userTarget, setUserTarget, setChannelTarget } = useContext(GlobalContext)!

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

	useEffect(() => {
		async function fetchUsersAndChannels() {
			try {
				const users = await axios.get("http://localhost:3333/user")

				setUserOptions(users.data.map((user: User) => ({
					user: { ...user },
					label: user.username,
					optionType: optionType.USER
				})))

				/* ============ Temporaire ============== */

				// const channels = await axios.get("http://localhost:3333/channel")

				const tempResponse: ChannelData[] = [
					{
						id: 0,
						name: "Public 1",
						avatar: DefaultChannelPicture,
						type: channelStatus.PUBLIC,
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
			if (option.optionType === optionType.USER && !userAuthenticate.friends.includes(option.user)) {
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
				if (option.channel.type === channelStatus.PUBLIC)
					setChatWindowState(chatWindowStatus.CHANNEL)
				else
					setChatWindowState(chatWindowStatus.LOCKED_CHANNEL)
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